import {create} from "zustand";
import {Settings} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
    settings: Settings;
    
    setSettings: (settings: Partial<Settings>) => void;
    resetSettings: () => Promise<void>;

    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set, get) => ({
    settings: {
        expiredNotification: true,
        soonExpirationNotification: true,
    },

    setSettings: async (settings) => {
        set((state) => ({
            settings: {
                ...state.settings,
                ...settings
            }
        }));
        await get().saveSettings();
    },

    resetSettings: async () => {
        const defaultSettings: Settings = {
            expiredNotification: true,
            soonExpirationNotification: true,
        };
        set({settings: defaultSettings});
        return await get().saveSettings();
    },

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

    saveSettings: async () => {
        try {
            const {settings} = get();
            await AsyncStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    }
}));