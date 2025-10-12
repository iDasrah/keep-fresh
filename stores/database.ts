import {create} from "zustand/react";
import {initDatabase, getAllItems, getItemsByStorage, searchItems, addItem} from "@/lib/db";
import {Item} from "@/types";

interface DatabaseState {
    isConnected: boolean;
    isConnecting: boolean;

    init: () => Promise<void>;
    getAllItems: () => Promise<any[]>;
    getAllItemsByStorage: (storage: string) => Promise<any[]>;
    searchItems: (query: string, storage?: string) => Promise<any[]>;
    addItem: (item: Omit<Item, 'id'>) => Promise<void>;
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

    addItem: async (item: Omit<Item, 'id'>) => {
        if (!get().isConnected) throw new Error("Database not connected");
        return await addItem(item);
    }
}));