import * as SQLite from 'expo-sqlite';

let dbInstance = null;
let connectionPromise = null;

export const getDbConnection = async () => {
    // If an instance already exists, return it immediately
    if (dbInstance) {
        return dbInstance;
    }

    // If a connection is already in progress, wait for that same promise
    if (!connectionPromise) {
        connectionPromise = (async () => {
            const db = await SQLite.openDatabaseAsync('SelectSwitch.db');
            
            // Configure concurrent write-ahead logging and set a 5-second busy retry window
            await db.execAsync(`
                PRAGMA journal_mode = WAL;
                PRAGMA busy_timeout = 5000;
            `);
            
            dbInstance = db;
            return db;
        })();
    }

    return connectionPromise;
};