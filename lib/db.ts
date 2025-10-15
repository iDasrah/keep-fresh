import {openDatabaseAsync, SQLiteDatabase} from "expo-sqlite";
import {Item, ShoppingListItem, Storage} from "@/types";

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
            storage TEXT CHECK( storage IN ('fridge', 'freezer', 'pantry') ) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS shopping_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

export async function addItem(item: Omit<Item, 'id' | 'createdAt'>): Promise<number> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    const prep = await db.prepareAsync(`
        INSERT INTO items (name, quantity, unit, expirationDate, storage) VALUES (?, ?, ?, ?, ?);
    `);
    const result = await prep.executeAsync([item.name, item.quantity, item.unit, item.expirationDate, item.storage]);
    await prep.finalizeAsync();

    return result.lastInsertRowId;
}

export async function deleteItem(id: number): Promise<void> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    const prep = await db.prepareAsync(`
        DELETE FROM items WHERE id = ?;
    `);
    await prep.executeAsync([id]);
    await prep.finalizeAsync();
}

export async function getShoppingList(): Promise<ShoppingListItem[]> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }

    return await db.getAllAsync(`
        SELECT * FROM shopping_list;
    `);
}

export async function addShoppingListItem(item: string): Promise<number> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    const prep = await db.prepareAsync(`
        INSERT INTO shopping_list (name) VALUES (?);
    `);
    const result = await prep.executeAsync([item]);
    await prep.finalizeAsync();

    return result.lastInsertRowId;
}

export async function deleteShoppingListItem(id: number): Promise<void> {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    const prep = await db.prepareAsync(`
        DELETE FROM shopping_list WHERE id = ?;
    `);
    await prep.executeAsync([id]);
    await prep.finalizeAsync();
}

export function clearDatabase() {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return db.execAsync(`
        DELETE FROM items;
        DELETE FROM shopping_list;
    `);
}

async function seedDatabase() {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }

    const items: Omit<Item, 'id' | 'createdAt'>[] = [
        {
            name: "Lait",
            quantity: 2,
            unit: "bouteille",
            expirationDate: "2025-11-10",
            storage: "fridge"
        },
        {
            name: "Poulet",
            quantity: 1,
            unit: "kg",
            expirationDate: "2025-10-23",
            storage: "freezer"
        },
        {
            name: "Pâtes",
            quantity: 3,
            unit: "paquet",
            expirationDate: "2026-03-02",
            storage: "pantry"
        }
    ];

    for (const item of items) {
        await addItem(item);
    }

    console.log("Database seeded with initial data.");
}