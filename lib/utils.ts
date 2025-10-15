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

export function getRandomAntiWasteMessage(score: number): {title: string, content: string} {
    if (score < 40) {
        return lang.stats.antiWasteMessages.low[Math.floor(Math.random() * lang.stats.antiWasteMessages.low.length)];
    } else if (score < 70) {
        return lang.stats.antiWasteMessages.medium[Math.floor(Math.random() * lang.stats.antiWasteMessages.medium.length)];
    }
    return lang.stats.antiWasteMessages.high[Math.floor(Math.random() * lang.stats.antiWasteMessages.high.length)];
}

export function getRandomConsumptionTimeMessage(days: number): string {
    if (days <= 2) {
        return lang.stats.avgConsumptionTime.subtitle.short[Math.floor(Math.random() * lang.stats.avgConsumptionTime.subtitle.short.length)];
    } else if (days <= 5) {
        return lang.stats.avgConsumptionTime.subtitle.medium[Math.floor(Math.random() * lang.stats.avgConsumptionTime.subtitle.medium.length)];
    }
    return lang.stats.avgConsumptionTime.subtitle.long[Math.floor(Math.random() * lang.stats.avgConsumptionTime.subtitle.long.length)];
}

export function getRandomPlaceholder(storage: "fridge" | "freezer" | "pantry"): string {
    return lang.addItem.form.name.placeholder[storage][Math.floor(Math.random() * lang.addItem.form.name.placeholder[storage].length)];
}

export function getRandomExpiredThisWeekMessage(count: number): string {
    if (count === 0) {
        return lang.stats.expiredThisWeek.subtitle.none[Math.floor(Math.random() * lang.stats.expiredThisWeek.subtitle.none.length)];
    } else if (count <= 3) {
        return lang.stats.expiredThisWeek.subtitle.few[Math.floor(Math.random() * lang.stats.expiredThisWeek.subtitle.few.length)];
    } else if (count <= 7) {
        return lang.stats.expiredThisWeek.subtitle.several[Math.floor(Math.random() * lang.stats.expiredThisWeek.subtitle.several.length)];
    }
    return lang.stats.expiredThisWeek.subtitle.many[Math.floor(Math.random() * lang.stats.expiredThisWeek.subtitle.many.length)];
}