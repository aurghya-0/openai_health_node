import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the SQLite database
export async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database,
    });
}

// Initialize the database (run this once to set up the table)
export async function initializeDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age TEXT,
            previousMedications TEXT,
            previousConditions TEXT,
            departmentSuggestion TEXT,
            emergency BOOLEAN
        );
    `);
    console.log("Database initialized");
}
