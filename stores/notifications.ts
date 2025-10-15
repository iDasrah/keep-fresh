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

    scheduleItemNotifications: (item: Omit<Item, 'createdAt'>) => Promise<void>;
    scheduleAllItemsExpiredNotifications: () => Promise<void>;
    scheduleAllItemsSoonExpiredNotifications: () => Promise<void>;
    cancelItemNotifications: (itemId: number) => void;

    clearAllNotifications: () => Promise<void>;
    clearAllExpiredNotifications: () => void;
    clearAllSoonExpiredNotifications: () => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
    notifications: [],

    scheduleItemNotifications: async (item: Omit<Item, 'createdAt'>) => {
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
    cancelItemNotifications: async (itemId: number) => {
        const notif = get().notifications.find(n => n.itemId === itemId);
        if (notif) {
            await Promise.all(notif.ids.map(id => cancelScheduledNotificationAsync(id)));
            set({notifications: get().notifications.filter(n => n.itemId !== itemId)});
        }
    },
    clearAllNotifications: async () => {
        const allIds = get().notifications.flatMap(notif => notif.ids);
        await Promise.all(allIds.map(id => cancelScheduledNotificationAsync(id)));
        set({notifications: []});
    },
    clearAllExpiredNotifications: async () => {
        const expiredIds = get().notifications
            .filter(n => n.ids.length > 0)
            .map(n => n.ids[0]);

        await Promise.all(expiredIds.map(id => cancelScheduledNotificationAsync(id)));

        const updatedNotifications = get().notifications.map(notif => ({
            ...notif,
            ids: notif.ids.slice(1)
        })).filter(n => n.ids.length > 0);

        set({notifications: updatedNotifications});
    },
    clearAllSoonExpiredNotifications: async () => {
        const soonExpiredIds = get().notifications
            .filter(n => n.ids.length > 1)
            .flatMap(n => n.ids.slice(1));

        await Promise.all(soonExpiredIds.map(id => cancelScheduledNotificationAsync(id)));

        const updatedNotifications = get().notifications.map(notif => ({
            ...notif,
            ids: notif.ids.length > 0 ? [notif.ids[0]] : []
        })).filter(n => n.ids.length > 0);

        set({notifications: updatedNotifications});
    },
}));