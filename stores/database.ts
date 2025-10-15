import {create} from "zustand/react";
import {
    initDatabase,
    getAllItems,
    getItemsByStorage,
    searchItems,
    addItem,
    deleteItem,
    clearDatabase,
    getShoppingList, addShoppingListItem, deleteShoppingListItem
} from "@/lib/db";
import {Item, ShoppingListItem} from "@/types";

interface DatabaseState {
    isConnected: boolean;
    isConnecting: boolean;

    init: () => Promise<void>;
    getAllItems: () => Promise<Item[]>;
    getAllItemsByStorage: (storage: string) => Promise<Item[]>;
    searchItems: (query: string, storage?: string) => Promise<Item[]>;
    addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<number>;
    deleteItem: (id: number) => Promise<void>;

    getShoppingList: () => Promise<ShoppingListItem[]>;
    addShoppingListItem: (item: string) => Promise<number>;
    deleteShoppingListItem: (id: number) => Promise<void>;

    clear: () => Promise<void>;
}

export const useDatabase = create<DatabaseState>((set, get) => ({
    isConnected: false,
    isConnecting: false,

    init: async () => {
        if (get().isConnected || get().isConnecting) return;

        set({isConnecting: true});
        await initDatabase()
        set({isConnected: true, isConnecting: false});
    },

    getAllItems: async () => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await getAllItems();
    },

    getAllItemsByStorage: async (storage: string) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await getItemsByStorage(storage as any);
    },

    searchItems: async (query: string, storage?: string) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await searchItems(query, storage as any);
    },

    addItem: async (item: Omit<Item, 'id' | 'createdAt'>) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await addItem(item);
    },

    deleteItem: async (id: number) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await deleteItem(id);
    },

    getShoppingList: async () => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await getShoppingList();
    },

    addShoppingListItem: async (item: string) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await addShoppingListItem(item);
    },

    deleteShoppingListItem: async (id: number) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await deleteShoppingListItem(id);
    },

    clear: async () => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await clearDatabase();
    }
}));