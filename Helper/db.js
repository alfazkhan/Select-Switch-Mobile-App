import { db } from './dbInstance';
import { fetchAllList, createList } from './Lists';
import { createListItem } from './ListItems';
import { createListItemProperty } from './listItemProperty';
import { createProperty } from './Properties';

export const init = () => {
    try {
        db.execute('PRAGMA foreign_keys = ON;');
        db.execute('PRAGMA journal_mode = WAL;');

        db.execute(`
            CREATE TABLE IF NOT EXISTS lists (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                listName TEXT NOT NULL, 
                listType TEXT NOT NULL, 
                repeatResults INTEGER NOT NULL, 
                storeResults INTEGER NOT NULL
            );
        `);

        db.execute(`
            CREATE TABLE IF NOT EXISTS listItems (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                listID INTEGER NOT NULL, 
                itemName TEXT NOT NULL,
                FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
            );
        `);

        db.execute(`
            CREATE TABLE IF NOT EXISTS properties (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                listID INTEGER NOT NULL, 
                propertyName TEXT NOT NULL, 
                importance INTEGER NOT NULL, 
                negative INTEGER NOT NULL,
                FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
            );
        `);

        db.execute(`
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
        `);

        db.execute(`
            CREATE TABLE IF NOT EXISTS results (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                listID INTEGER NOT NULL, 
                result TEXT NOT NULL,
                FOREIGN KEY (listID) REFERENCES lists (id) ON DELETE CASCADE
            );
        `);

        initialiseData();
        return true;
    } catch (error) {
        console.error('Database layout initialization failed:', error);
        throw error;
    }
};

export const initialiseData = () => {
    try {
        const res = fetchAllList();
        if (res.rows._array.length === 0) {
            db.transaction(() => {
                let randomRes = createList("Breakfast", "random", 1, 1);
                let randomID = randomRes.insertId;

                let logicalRes = createList("Lunch", "logical", 1, 1);
                let logicalID = logicalRes.insertId;

                const listItems = ["Poha", "Burger", "Rice"];
                const IDs = [randomID, logicalID];
                const listItemIDs = [];

                for (let i = 0; i < IDs.length; i++) {
                    for (let j = 0; j < listItems.length; j++) {
                        let listItemRes = createListItem(IDs[i], listItems[j]);
                        if (IDs[i] === logicalID) {
                            listItemIDs.push(listItemRes.insertId);
                        }
                    }
                }

                const property = ["Taste", "Calories"];
                const propertyIds = [];
                for (let i = 0; i < 2; i++) {
                    const propertyRes = createProperty(
                        logicalID, 
                        property[i], 
                        Math.floor(Math.random() * 100), 
                        i
                    );
                    propertyIds.push(propertyRes.insertId);
                }

                for (let i = 0; i < listItemIDs.length; i++) {
                    for (let j = 0; j < propertyIds.length; j++) {
                        createListItemProperty(listItemIDs[i], propertyIds[j], logicalID, 100);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Failed to pre-seed initial application data:', error);
        throw error;
    }
};