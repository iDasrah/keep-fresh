import {create} from "zustand";
import {Settings} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Store Zustand pour gérer les préférences utilisateur.
 *
 * SETTINGS DISPONIBLES :
 * - expiredNotification : Active/désactive les notifications "produit expiré" (jour J)
 * - soonExpirationNotification : Active/désactive les notifications "bientôt expiré" (3 jours avant)
 *
 * PERSISTANCE :
 * - AsyncStorage (key: 'settings')
 * - Chargement automatique au démarrage de l'app (dans _layout.tsx)
 * - Sauvegarde automatique après chaque modification (setSettings)
 *
 * VALEURS PAR DÉFAUT :
 * - Les deux notifications sont activées par défaut (true)
 */
interface SettingsState {
    settings: Settings;

    setSettings: (settings: Partial<Settings>) => void;
    resetSettings: () => Promise<void>;

    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set, get) => ({
    /**
     * État initial des settings.
     * Toutes les notifications sont activées par défaut.
     */
    settings: {
        expiredNotification: true,
        soonExpirationNotification: true,
    },

    /**
     * Met à jour un ou plusieurs settings.
     * Utilise Partial<Settings> pour permettre de ne modifier qu'une seule propriété.
     *
     * @param settings - Objet partiel avec les settings à modifier
     *
     * EXEMPLE :
     * setSettings({ expiredNotification: false }) // Désactive seulement les notifs expired
     *
     * FLOW :
     * 1. Merge avec les settings existants (spread operator)
     * 2. Sauvegarde automatiquement dans AsyncStorage
     */
    setSettings: async (settings) => {
        set((state) => ({
            settings: {
                ...state.settings,
                ...settings
            }
        }));
        await get().saveSettings();
    },

    /**
     * Reset tous les settings aux valeurs par défaut.
     * Appelé lors de la suppression complète des données dans settings.tsx.
     *
     * FLOW :
     * 1. Recrée l'objet defaultSettings
     * 2. Set dans le state
     * 3. Sauvegarde dans AsyncStorage
     */
    resetSettings: async () => {
        const defaultSettings: Settings = {
            expiredNotification: true,
            soonExpirationNotification: true,
        };
        set({settings: defaultSettings});
        return await get().saveSettings();
    },

    /**
     * Charge les settings depuis AsyncStorage.
     * Appelé au démarrage de l'app (dans _layout.tsx initApp).
     *
     * FLOW :
     * 1. Récupère la string JSON depuis AsyncStorage
     * 2. Parse et set dans le state
     * 3. Si aucune donnée : Garde les valeurs par défaut (pas d'erreur)
     *
     * ERROR HANDLING :
     * - try/catch pour éviter un crash si AsyncStorage échoue
     * - console.error pour debug
     */
    loadSettings: async () => {
        try {
            const settingsString = await AsyncStorage.getItem('settings');
            if (settingsString) {
                const settings = JSON.parse(settingsString);
                set({settings});
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    },

    /**
     * Sauvegarde les settings dans AsyncStorage.
     * Appelé automatiquement après chaque setSettings.
     *
     * FLOW :
     * 1. Récupère le state actuel
     * 2. Stringify en JSON
     * 3. Sauvegarde dans AsyncStorage (key: 'settings')
     *
     * ERROR HANDLING :
     * - try/catch pour gérer les erreurs AsyncStorage
     * - console.error pour debug
     */
    saveSettings: async () => {
        try {
            const {settings} = get();
            await AsyncStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    }
}));