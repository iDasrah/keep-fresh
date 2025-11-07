export type LocationProduct = {
    id: string;
    productId: string;
    locationId: string;
    containerType: keyof typeof Storage;
    expirationDate: string;
    quantity: number;
    createdAt: string;
    product?: Product;
}

export type Product = {
    id: string;
    name: string;
    barcode: string;
    quantity: number;
    unit: Unit;
    isComplete: boolean;
    createdAt: string;
    updatedAt: string;
    images?: ProductImage[];
}

export type ProductImage = {
    id: string;
    url: string;
    type: ProductImageType;
    productId: string;
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

export type ProductImageType = 'FULL' | 'SMALL' | 'THUMB';

export type Unit = 'g' | 'kg' | 'L' | 'ml' | 'cl' | 'pcs';

export enum Storage {
    'FRIDGE' = 'FRIDGE',
    'FREEZER' = 'FREEZER',
    'PANTRY' = 'PANTRY',
    'OTHER' = 'OTHER',
}