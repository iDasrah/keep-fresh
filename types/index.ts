export type Item = {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    expirationDate: string;
    storage: Storage,
    createdAt: string;
}

export type Stats = {
    antiWasteScore: number;
    totalAddedItems: number;
    thrownAwayItems: number;
    expiredThisWeek: number;
    averageConsumptionTime: number;
    antiWasteScoreByWeek: number[];
}

export type Settings = {
    expiredNotification: boolean;
    soonExpirationNotification: boolean;
}

export type ShoppingListItem = {
    id: number;
    name: string;
    createdAt: string;
}

export type Storage = 'FRIDGE' | 'FREEZER' | 'PANTRY' | 'OTHER';