import {colors} from "@/constants/colors";
import lang from "@/lib/lang";

export function getItemStatus(expirationDate: string): 'expired' | 'expiringSoon' | 'fresh' {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'expired';
    } else if (diffDays <= 3) {
        return 'expiringSoon';
    } else {
        return 'fresh';
    }
}

export function getProgressColor(percentage: number): string {
    if (percentage < 40) {
        return colors.danger;
    } else if (percentage < 70) {
        return colors.warning;
    } else {
        return colors.success;
    }
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomAntiWasteMessage(score: number): {title: string, content: string} {
    if (score < 40) {
        return getRandomItem(lang.stats.antiWasteMessages.low);
    } else if (score < 70) {
        return getRandomItem(lang.stats.antiWasteMessages.medium);
    }
    return getRandomItem(lang.stats.antiWasteMessages.high);
}

export function getRandomConsumptionTimeMessage(days: number): string {
    if (days <= 2) {
        return getRandomItem(lang.stats.avgConsumptionTime.subtitle.short);
    } else if (days <= 5) {
        return getRandomItem(lang.stats.avgConsumptionTime.subtitle.medium);
    }
    return getRandomItem(lang.stats.avgConsumptionTime.subtitle.long);
}

export function getRandomPlaceholder(storage: "fridge" | "freezer" | "pantry"): string {
    return getRandomItem(lang.addItem.form.name.placeholder[storage]);
}

export function getRandomExpiredThisWeekMessage(count: number): string {
    if (count === 0) {
        return getRandomItem(lang.stats.expiredThisWeek.subtitle.none);
    } else if (count <= 3) {
        return getRandomItem(lang.stats.expiredThisWeek.subtitle.few);
    } else if (count <= 7) {
        return getRandomItem(lang.stats.expiredThisWeek.subtitle.some);
    }
    return getRandomItem(lang.stats.expiredThisWeek.subtitle.many);
}