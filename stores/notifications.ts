import {create} from "zustand";
import {Item} from "@/types";
import {
    scheduleItemExpirationNotification,
    scheduleItemExpirationSoonNotification,
    scheduleItemNotifications
} from "@/lib/notifications";
import {cancelScheduledNotificationAsync} from "expo-notifications";
import {useSettings} from "@/stores/settings";
import {useDatabase} from "@/stores/database";

/**
 * Store Zustand pour gérer les notifications push locales.
 *
 * STRUCTURE DES DONNÉES :
 * notifications = [
 *   { ids: ["notif-123", "notif-456"], itemId: 1 },
 *   { ids: ["notif-789"], itemId: 2 },
 * ]
 *
 * IMPORTANT : Chaque item a 2 notifications max :
 * - ids[0] : Notification "produit expiré" (le jour J)
 * - ids[1] : Notification "bientôt expiré" (3 jours avant) (optionnel)
 *
 * FONCTIONNALITÉS :
 * - Schedule : Programme les notifications pour un item ou tous les items
 * - Cancel : Annule les notifications d'un item ou de tous les items
 * - Clear : Supprime sélectivement (expired only, soon expired only, ou tout)
 *
 * INTÉGRATION SETTINGS :
 * - Vérifie les settings avant de scheduler (expiredNotification, soonExpirationNotification)
 * - Permet d'activer/désactiver les types de notifications
 */
interface NotificationsState {
    notifications: { ids: string[], itemId: number }[];

    scheduleItemNotifications: (item: Omit<Item, 'createdAt'>) => Promise<void>;
    scheduleAllItemsExpiredNotifications: () => Promise<void>;
    scheduleAllItemsSoonExpiredNotifications: () => Promise<void>;
    cancelItemNotifications: (itemId: number) => void;

    clearAllNotifications: () => Promise<void>;
    clearAllExpiredNotifications: () => void;
    clearAllSoonExpiredNotifications: () => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
    /**
     * État : Liste des notifications programmées.
     * Chaque entrée contient les IDs de notifications Expo et l'itemId associé.
     */
    notifications: [],

    /**
     * Schedule les 2 notifications (expired + soon expired) pour un item.
     * Appelé lors de l'ajout d'un produit.
     *
     * @param item - Item sans createdAt (Omit pour éviter d'envoyer des champs inutiles)
     * @returns Promise<void>
     *
     * FLOW :
     * 1. Appelle scheduleItemNotifications (lib/notifications.ts)
     * 2. Retourne un tableau [expiredId, soonExpiredId] (ou [expiredId] si une seule)
     * 3. Filter les null (au cas où une notification échoue)
     * 4. Ajoute l'entrée dans le state
     */
    scheduleItemNotifications: async (item: Omit<Item, 'createdAt'>) => {
        const ids = (await scheduleItemNotifications(item.name, new Date(item.expirationDate), item.id.toString()))
            .filter((id): id is string => id !== null);
        set({notifications: [...get().notifications, {ids, itemId: item.id}]});
    },

    /**
     * Re-schedule TOUTES les notifications "produit expiré" (jour J).
     * Appelé quand l'utilisateur active le toggle "expiredNotification" dans les settings.
     *
     * FLOW :
     * 1. Vérifie que le setting est activé (sinon return)
     * 2. Récupère tous les items de la DB
     * 3. Pour chaque item :
     *    a. Annule les anciennes notifications
     *    b. Schedule une nouvelle notification "expired"
     *
     * IMPORTANT : Utilise getState() pour accéder aux autres stores (settings, database)
     */
    scheduleAllItemsExpiredNotifications: async () => {
        const {settings} = useSettings.getState();
        if (!settings.expiredNotification) return;

        const {getAllItems} = useDatabase.getState();
        const items = await getAllItems();
        for (const item of items) {
            get().cancelItemNotifications(item.id);
            await scheduleItemExpirationNotification(item.name, new Date(item.expirationDate), item.id.toString());
        }
    },

    /**
     * Re-schedule TOUTES les notifications "bientôt expiré" (3 jours avant).
     * Appelé quand l'utilisateur active le toggle "soonExpirationNotification" dans les settings.
     *
     * FLOW : Identique à scheduleAllItemsExpiredNotifications mais pour "soon expired"
     */
    scheduleAllItemsSoonExpiredNotifications: async () => {
        const {settings} = useSettings.getState();
        if (!settings.soonExpirationNotification) return;

        const {getAllItems} = useDatabase.getState();
        const items = await getAllItems();
        for (const item of items) {
            get().cancelItemNotifications(item.id);
            await scheduleItemExpirationSoonNotification(item.name, new Date(item.expirationDate), item.id.toString());
        }
    },
    /**
     * Annule TOUTES les notifications d'un item spécifique.
     * Appelé quand l'utilisateur supprime un produit.
     *
     * @param itemId - ID de l'item à supprimer
     *
     * FLOW :
     * 1. Trouve l'entrée notifications correspondante
     * 2. Annule toutes les notifications (Promise.all pour optimisation)
     * 3. Supprime l'entrée du state
     *
     * IMPORTANT : Promise.all au lieu de forEach pour attendre toutes les annulations
     * (bug critique corrigé : forEach + async ne marchait pas)
     */
    cancelItemNotifications: async (itemId: number) => {
        const notif = get().notifications.find(n => n.itemId === itemId);
        if (notif) {
            await Promise.all(notif.ids.map(id => cancelScheduledNotificationAsync(id)));
            set({notifications: get().notifications.filter(n => n.itemId !== itemId)});
        }
    },

    /**
     * Annule TOUTES les notifications (expired + soon expired).
     * Appelé lors de la suppression complète des données dans settings.
     *
     * FLOW :
     * 1. flatMap pour obtenir tous les IDs (tous types confondus)
     * 2. Promise.all pour annuler en parallèle (optimisation)
     * 3. Reset du state à []
     */
    clearAllNotifications: async () => {
        const allIds = get().notifications.flatMap(notif => notif.ids);
        await Promise.all(allIds.map(id => cancelScheduledNotificationAsync(id)));
        set({notifications: []});
    },

    /**
     * Annule uniquement les notifications "produit expiré" (ids[0]).
     * Appelé quand l'utilisateur désactive le toggle "expiredNotification".
     *
     * FLOW :
     * 1. Récupère tous les ids[0] (première notification = expired)
     * 2. Annule ces notifications
     * 3. Supprime ids[0] de chaque entrée (slice(1) = garde seulement ids[1])
     * 4. Filter les entrées vides (si plus aucune notification)
     *
     * RÉSULTAT : Ne garde que les notifications "soon expired" (ids[1])
     */
    clearAllExpiredNotifications: async () => {
        const expiredIds = get().notifications
            .filter(n => n.ids.length > 0)
            .map(n => n.ids[0]); // Première notification = expired

        await Promise.all(expiredIds.map(id => cancelScheduledNotificationAsync(id)));

        const updatedNotifications = get().notifications.map(notif => ({
            ...notif,
            ids: notif.ids.slice(1) // Garde seulement ids[1] (soon expired)
        })).filter(n => n.ids.length > 0);

        set({notifications: updatedNotifications});
    },

    /**
     * Annule uniquement les notifications "bientôt expiré" (ids[1]).
     * Appelé quand l'utilisateur désactive le toggle "soonExpirationNotification".
     *
     * FLOW :
     * 1. Récupère tous les ids[1] (deuxième notification = soon expired)
     * 2. Annule ces notifications
     * 3. Supprime ids[1] de chaque entrée (garde seulement ids[0])
     * 4. Filter les entrées vides
     *
     * RÉSULTAT : Ne garde que les notifications "expired" (ids[0])
     */
    clearAllSoonExpiredNotifications: async () => {
        const soonExpiredIds = get().notifications
            .filter(n => n.ids.length > 1) // Au moins 2 notifications
            .flatMap(n => n.ids.slice(1)); // Toutes sauf la première

        await Promise.all(soonExpiredIds.map(id => cancelScheduledNotificationAsync(id)));

        const updatedNotifications = get().notifications.map(notif => ({
            ...notif,
            ids: notif.ids.length > 0 ? [notif.ids[0]] : [] // Garde seulement ids[0]
        })).filter(n => n.ids.length > 0);

        set({notifications: updatedNotifications});
    },
}));