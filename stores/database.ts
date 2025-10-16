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

/**
 * Store Zustand pour gérer la connexion et les opérations de base de données SQLite.
 *
 * Ce store agit comme une couche d'abstraction entre l'UI et la base de données,
 * en gérant l'état de connexion et en s'assurant que la DB est initialisée avant toute opération.
 */
interface DatabaseState {
    // État de la connexion
    isConnected: boolean;
    isConnecting: boolean;

    // Initialisation de la DB
    init: () => Promise<void>;

    // Gestion des items du frigo
    getAllItems: () => Promise<Item[]>;
    getAllItemsByStorage: (storage: string) => Promise<Item[]>;
    searchItems: (query: string, storage?: string) => Promise<Item[]>;
    addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<number>;
    deleteItem: (id: number) => Promise<void>;

    // Gestion de la liste de courses
    getShoppingList: () => Promise<ShoppingListItem[]>;
    addShoppingListItem: (item: string) => Promise<number>;
    deleteShoppingListItem: (id: number) => Promise<void>;

    // Utilitaires
    clear: () => Promise<void>;
}

export const useDatabase = create<DatabaseState>((set, get) => ({
    isConnected: false,
    isConnecting: false,

    /**
     * Initialise la connexion à la base de données SQLite.
     * Appelé au démarrage de l'app dans _layout.tsx
     */
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