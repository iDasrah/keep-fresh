import {
    cancelScheduledNotificationAsync,
    Notification,
    NotificationBehavior,
    SchedulableTriggerInputTypes,
    scheduleNotificationAsync
} from "expo-notifications";
import lang from "./lang";
import {subDays} from "date-fns";

export async function handler(notification: Notification): Promise<NotificationBehavior> {
    return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }
}

export async function scheduleItemNotifications(itemName: string, expirationDate: Date, id: string) {
    const expirationNotificationId = await scheduleItemExpirationNotification(itemName, expirationDate, id);
    const expirationSoonNotificationId = await scheduleItemExpirationSoonNotification(itemName, expirationDate, id);
    return { expirationNotificationId, expirationSoonNotificationId };
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
        },
    });
}

export async function scheduleItemExpirationSoonNotification(itemName: string, expirationDate: Date, id: string) {
    return await scheduleNotificationAsync({
        content: {
            title: lang.notifications.itemExpiringSoon.title,
            body: lang.notifications.itemExpiringSoon.body(itemName, 3),
            data: { itemId: id },
        },
        trigger: {
            date: subDays(new Date(expirationDate), 3),
            type: SchedulableTriggerInputTypes.DATE
        },
    });
}

export async function cancelItemExpirationNotification(id: string) {
    return await cancelScheduledNotificationAsync(id);
}