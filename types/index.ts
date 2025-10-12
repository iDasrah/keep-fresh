export type Item = {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    expirationDate: string;
    storage: Storage
}

export type Stats = {
    totalAddedItems: number;
    thrownAwayItems: number;
    expiredThisWeek: number;
    averageConsumptionTime: number;
    antiWasteScoreByWeek: number[];
}

export type Settings = {
    expiredNotification: boolean;
    soonExpirationNotification: boolean;
    dailyReminder: boolean;
}

export type Storage = 'fridge' | 'freezer' | 'pantry';