import {
    Notification,
    NotificationBehavior,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync
} from "expo-notifications";
import lang from "./lang";
import {subDays} from "date-fns";
import {useSettings} from "@/stores/settings";

export async function handler(notification: Notification): Promise<NotificationBehavior> {
    return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }
}

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
            // seconds: 10,
            // type: SchedulableTriggerInputTypes.TIME_INTERVAL
        },
    });
}

export async function scheduleItemExpirationSoonNotification(itemName: string, expirationDate: Date, id: string) {
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
            date: subDays(new Date(expirationDate), 3),
            type: SchedulableTriggerInputTypes.DATE
            // seconds: 5,
            // type: SchedulableTriggerInputTypes.TIME_INTERVAL
        },
    });
}
