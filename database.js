import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

// Open the SQLite database
export async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database,
    });
}

// Initialize the database if it doesn't exist
export async function initializeDb() {
    const dbFile = './database.db';

    if (!fs.existsSync(dbFile)) {
        console.log("Database file does not exist, creating and initializing the database...");

        const db = await openDb();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age TEXT,
                previousMedications TEXT,
                previousConditions TEXT,
                departmentSuggestion TEXT,
                emergency BOOLEAN,
                patientQuery TEXT  -- New column to store the patient query
            );
        `);

        console.log("Database initialized.");
    } else {
        console.log("Database file exists, no need to initialize.");
    }
}
