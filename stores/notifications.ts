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

interface NotificationsState {
    notifications: { ids: string[], itemId: number }[];

    scheduleItemNotifications: (item: Item) => Promise<void>;
    scheduleAllItemsExpiredNotifications: () => Promise<void>;
    scheduleAllItemsSoonExpiredNotifications: () => Promise<void>;
    cancelItemNotifications: (itemId: number) => void;

    clearAllNotifications: () => Promise<void>;
    clearAllExpiredNotifications: () => void;
    clearAllSoonExpiredNotifications: () => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
    notifications: [],

    scheduleItemNotifications: async (item: Item) => {
        const ids = (await scheduleItemNotifications(item.name, new Date(item.expirationDate), item.id.toString()))
            .filter((id): id is string => id !== null);
        set({notifications: [...get().notifications, {ids, itemId: item.id}]});
    },
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
    cancelItemNotifications: (itemId: number) => {
        const notif = get().notifications.find(n => n.itemId === itemId);
        if (notif) {
            notif.ids.forEach(async (id) => await cancelScheduledNotificationAsync(id));
            set({notifications: get().notifications.filter(n => n.itemId !== itemId)});
        }
    },
    clearAllNotifications: () => {
        get().notifications.forEach(notif => {
            notif.ids.forEach(async (id) => await cancelScheduledNotificationAsync(id));
        });
        set({notifications: []});
        return Promise.resolve();
    },
    clearAllExpiredNotifications: () => {
        get().notifications.forEach(async (notif) => {
            if (notif.ids.length > 0) {
                const [expiredId] = notif.ids;
                await cancelScheduledNotificationAsync(expiredId);
                notif.ids.splice(0, 1);
            }
        });
        set({notifications: get().notifications.filter(n => n.ids.length > 0)});
    },
    clearAllSoonExpiredNotifications: () => {
        get().notifications.forEach(notif => {
            if (notif.ids.length > 1) {
                const soonExpiredIds = notif.ids.slice(1);
                soonExpiredIds.forEach(async (id) => await cancelScheduledNotificationAsync(id));
                notif.ids.splice(1, notif.ids.length - 1);
            }
        });
        set({notifications: get().notifications.filter(n => n.ids.length > 0)});
    },
}));