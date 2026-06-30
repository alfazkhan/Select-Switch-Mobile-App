import { getDbConnection } from './dbInstance';

export const createList = async (listName, listType, repeatResults, storeResults) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync(
            'INSERT INTO lists (listName, listType, repeatResults, storeResults) VALUES (?, ?, ?, ?);',
            [listName, listType, repeatResults ? 1 : 0, storeResults ? 1 : 0]
        );
        return {
            insertId: result.lastInsertRowId,
            rowsAffected: result.changes
        };
    } catch (error) {
        console.error('Failed to create list entry:', error);
        throw error;
    }
};

export const updateList = async (listName, id) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync(
            'UPDATE lists SET listName = ? WHERE id = ?;',
            [listName, id]
        );
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to update target list name:', error);
        throw error;
    }
};

export const fetchList = async (id) => {
    try {
        const db = await getDbConnection();
        const records = await db.getAllAsync('SELECT * FROM lists WHERE id = ?;', [id]);
        return {
            rows: {
                _array: records,
                length: records.length
            }
        };
    } catch (error) {
        console.error('Failed to fetch target list details:', error);
        throw error;
    }
};

export const deleteList = async (id) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM lists WHERE id = ?;', [id]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to delete target list configuration:', error);
        throw error;
    }
};

export const fetchAllList = async () => {
    try {
        const db = await getDbConnection();
        const records = await db.getAllAsync('SELECT * FROM lists;');
        return {
            rows: {
                _array: records,
                length: records.length
            }
        };
    } catch (error) {
        console.error('Failed to fetch collection arrays from lists:', error);
        throw error;
    }
};

export const deleteAllList = async () => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM lists;');
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to purge list storage tables:', error);
        throw error;
    }
};