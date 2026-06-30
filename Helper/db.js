import { getDbConnection } from './dbInstance';
import { fetchAllList, createList } from './Lists';
import { createListItem } from './ListItems';
import { createListItemProperty } from './listItemProperty';
import { createProperty } from './Properties';

let initPromise = null;

export const init = async () => {
    if (!initPromise) {
        initPromise = (async () => {
            try {
                const db = await getDbConnection();
                
                // Enforce single exclusive transaction block for database generation
                await db.withTransactionAsync(async () => {
                    await db.execAsync(`
                        PRAGMA foreign_keys = ON;

                        CREATE TABLE IF NOT EXISTS lists (
                            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                            listName TEXT NOT NULL, 
                            listType TEXT NOT NULL, 
                            repeatResults INTEGER NOT NULL, 
                            storeResults INTEGER NOT NULL
                        );

                        CREATE TABLE IF NOT EXISTS listItems (
                            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                            listID INTEGER NOT NULL, 
                            itemName TEXT NOT NULL,
                            FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
                        );

                        CREATE TABLE IF NOT EXISTS properties (
                            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            listID INTEGER NOT NULL, 
                            propertyName TEXT NOT NULL, 
                            importance INTEGER NOT NULL, 
                            negative INTEGER NOT NULL,
                            FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
                        );

                        CREATE TABLE IF NOT EXISTS listItemProperty (
                            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                            listItemID INTEGER NOT NULL,
                            listID INTEGER NOT NULL, 
                            propertyID INTEGER NOT NULL, 
                            value INTEGER NOT NULL,
                            FOREIGN KEY (listItemID) REFERENCES listItems (id) ON DELETE CASCADE,
                            FOREIGN KEY (propertyID) REFERENCES properties (id) ON DELETE CASCADE,
                            FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
                        );

                        CREATE TABLE IF NOT EXISTS results (
                            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                            listID INTEGER NOT NULL, 
                            result TEXT NOT NULL,
                            FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
                        );
                    `);
                });

                // Pre-seed initial rows outside structure locks
                await initialiseData();
                return true;
            } catch (error) {
                initPromise = null;
                console.error('Database setup sequence crashed:', error);
                throw error;
            }
        })();
    }
    return initPromise;
};

export const initialiseData = async () => {
    try {
        const res = await fetchAllList();
        if (res.rows._array.length === 0) {
            const db = await getDbConnection();
            
            await db.withTransactionAsync(async () => {
                let randomRes = await createList("Breakfast", "random", 1, 1);
                let randomID = randomRes.insertId;

                let logicalRes = await createList("Lunch", "logical", 1, 1);
                let logicalID = logicalRes.insertId;

                const listItems = ["Poha", "Burger", "Rice"];
                const IDs = [randomID, logicalID];
                const listItemIDs = [];

                for (let i = 0; i < IDs.length; i++) {
                    for (let j = 0; j < listItems.length; j++) {
                        let listItemRes = await createListItem(IDs[i], listItems[j]);
                        if (IDs[i] === logicalID) {
                            listItemIDs.push(listItemRes.insertId);
                        }
                    }
                }

                const property = ["Taste", "Calories"];
                const propertyIds = [];
                for (let i = 0; i < 2; i++) {
                    const propertyRes = await createProperty(
                        logicalID, 
                        property[i], 
                        Math.floor(Math.random() * 100), 
                        i
                    );
                    propertyIds.push(propertyRes.insertId);
                }

                for (let i = 0; i < listItemIDs.length; i++) {
                    for (let j = 0; j < propertyIds.length; j++) {
                        await createListItemProperty(listItemIDs[i], propertyIds[j], logicalID, 100);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Failed to pre-seed application configuration context:', error);
        throw error;
    }
};