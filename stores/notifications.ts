import {create} from "zustand";
import {Item} from "@/types";
import {scheduleItemNotifications} from "@/lib/notifications";
import {cancelScheduledNotificationAsync} from "expo-notifications";

interface NotificationsState {
    notifications: { ids: string[], itemId: number }[];
    scheduleItemNotifications: (item: Item) => void;
    cancelItemNotifications: (itemId: number) => void;
    clearAllNotifications: () => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
    notifications: [],

    scheduleItemNotifications: async (item: Item) => {
        const ids = await scheduleItemNotifications(item.name, new Date(item.expirationDate), item.id.toString());
        set({notifications: [...get().notifications, {ids, itemId: item.id}]});
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
    }
}));