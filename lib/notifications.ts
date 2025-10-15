import {
    Notification,
    NotificationBehavior,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync
} from "expo-notifications";
import lang from "./lang";
import {subDays} from "date-fns";
import {useSettings} from "@/stores/settings";

/**
 * === NOTIFICATIONS LOCALES ===
 *
 * Gère le scheduling des notifications push locales pour les produits.
 *
 * TYPES DE NOTIFICATIONS :
 * 1. "Produit expiré" (jour J) - Notification le jour de l'expiration
 * 2. "Bientôt expiré" (3 jours avant) - Notification 3 jours avant expiration
 *
 * INTÉGRATION :
 * - Expo Notifications pour le scheduling
 * - date-fns (subDays) pour calcul des dates
 * - Zustand settings pour activer/désactiver les notifications
 *
 * TRIGGER :
 * - SchedulableTriggerInputTypes.DATE : Notification à une date précise
 * - Lignes commentées (TIME_INTERVAL) : Pour tests (déclenche après X secondes)
 */

/**
 * Handler de notification (appelé quand une notification arrive).
 *
 * COMPORTEMENT :
 * - shouldPlaySound: false (pas de son)
 * - shouldSetBadge: false (pas de badge sur l'icône)
 * - shouldShowBanner: true (affiche la bannière en haut de l'écran)
 * - shouldShowList: true (affiche dans la liste des notifications)
 */
export async function handler(notification: Notification): Promise<NotificationBehavior> {
    return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }
}

/**
 * Schedule les 2 types de notifications pour un item (expired + soon expired).
 * Appelé lors de l'ajout d'un produit.
 *
 * @param itemName - Nom du produit
 * @param expirationDate - Date d'expiration
 * @param id - ID du produit (pour data)
 * @returns Array d'IDs de notifications (peut contenir null)
 *
 * FLOW :
 * 1. Vérifie les settings (expiredNotification, soonExpirationNotification)
 * 2. Schedule uniquement les notifications activées
 * 3. Retourne un tableau avec les IDs (ex: ["notif-123", "notif-456"])
 *
 * IMPORTANT : Vérifie les settings AVANT de scheduler (évite de créer des notifs inutiles)
 */
export async function scheduleItemNotifications(itemName: string, expirationDate: Date, id: string) {
    const settings = useSettings.getState().settings;
    let ids = [];

    if (settings.expiredNotification) {
        ids.push(await scheduleItemExpirationNotification(itemName, expirationDate, id));
    }

    if (settings.soonExpirationNotification) {
        ids.push(await scheduleItemExpirationSoonNotification(itemName, expirationDate, id));
    }

    return ids;
}

/**
 * Schedule une notification "produit expiré" (le jour J).
 *
 * @param itemName - Nom du produit
 * @param expirationDate - Date d'expiration
 * @param id - ID du produit
 * @returns ID de la notification Expo
 *
 * CONTENU :
 * - Titre : lang.notifications.itemExpired.title ("Produit expiré")
 * - Body : lang.notifications.itemExpired.body(itemName) ("Votre {produit} a expiré")
 * - Data : { itemId: id } (peut être utilisé pour ouvrir l'item quand on tape la notif)
 *
 * TRIGGER :
 * - DATE : Notification exactement à la date d'expiration (expirationDate)
 */
export async function scheduleItemExpirationNotification(itemName: string, expirationDate: Date, id: string) {
    return await scheduleNotificationAsync({
        content: {
            title: lang.notifications.itemExpired.title,
            body: lang.notifications.itemExpired.body(itemName),
            data: { itemId: id },
        },
        trigger: {
            date: expirationDate,
            type: SchedulableTriggerInputTypes.DATE
            // seconds: 10, // DEBUG : Pour tester avec une notif après 10 secondes
            // type: SchedulableTriggerInputTypes.TIME_INTERVAL
        },
    });
}

/**
 * Schedule une notification "bientôt expiré" (3 jours avant).
 *
 * @param itemName - Nom du produit
 * @param expirationDate - Date d'expiration
 * @param id - ID du produit
 * @returns ID de la notification Expo, ou null si impossible de scheduler
 *
 * VALIDATION :
 * Si (expirationDate - 3 jours) < maintenant : return null
 * → Évite de scheduler une notification dans le passé
 * → Ex: Si le produit expire dans 2 jours, on ne peut pas notifier 3 jours avant
 *
 * TRIGGER :
 * - DATE : Notification 3 jours avant l'expiration (subDays(expirationDate, 3))
 */
export async function scheduleItemExpirationSoonNotification(itemName: string, expirationDate: Date, id: string) {
    // Vérification : Si 3 jours avant = dans le passé, on ne schedule pas
    if (subDays(new Date(expirationDate), 3) < new Date()) {
        return null;
    }

    return await scheduleNotificationAsync({
        content: {
            title: lang.notifications.itemExpiringSoon.title,
            body: lang.notifications.itemExpiringSoon.body(itemName, 3),
            data: { itemId: id },
        },
        trigger: {
            date: subDays(new Date(expirationDate), 3), // 3 jours avant
            type: SchedulableTriggerInputTypes.DATE
            // seconds: 5, // DEBUG : Pour tester avec une notif après 5 secondes
            // type: SchedulableTriggerInputTypes.TIME_INTERVAL
        },
    });
}
