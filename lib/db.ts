import {openDatabaseAsync, SQLiteDatabase} from "expo-sqlite";
import {Item, Storage} from "@/types";

export const DATABASE_NAME = "fridgely.db";
let db: SQLiteDatabase | null = null;

export async function initDatabase() {
    if (!db) {
        db = await openDatabaseAsync(DATABASE_NAME);
    }

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit TEXT NOT NULL,
            expirationDate TEXT NOT NULL,
            storage TEXT CHECK( storage IN ('fridge', 'freezer', 'pantry') ) NOT NULL
        );
    `);

    return db;
}

export function getDatabase(): SQLiteDatabase {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return db;
}

export async function getAllItems(): Promise<Item[]> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return await db.getAllAsync(`
        SELECT * FROM items;
    `);
}

export async function getItemsByStorage(storage: Storage): Promise<Item[]> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return await db.getAllAsync(`
        SELECT * FROM items WHERE storage = ?;
    `, [storage]);
}

export async function searchItems(query: string, storage?: Storage): Promise<Item[]> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    if (storage) {
        return await db.getAllAsync(`
            SELECT * FROM items WHERE name LIKE ? AND storage = ?;
        `, [`%${query}%`, storage]);
    } else {
        return await db.getAllAsync(`
            SELECT * FROM items WHERE name LIKE ?;
        `, [`%${query}%`]);
    }
}

export async function addItem(item: Omit<Item, 'id'>): Promise<void> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    const prep = await db.prepareAsync(`
        INSERT INTO items (name, quantity, unit, expirationDate, storage) VALUES (?, ?, ?, ?, ?);
    `);
    await prep.executeAsync([item.name, item.quantity, item.unit, item.expirationDate, item.storage]);
    await prep.finalizeAsync();
}