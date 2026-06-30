import { getDbConnection } from './dbInstance';

export const createListItem = async (listID, itemName) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync(
            'INSERT INTO listItems (listID, itemName) VALUES (?, ?);',
            [listID, itemName]
        );
        return {
            insertId: result.lastInsertRowId,
            rowsAffected: result.changes
        };
    } catch (error) {
        console.error('Failed to build list item entry:', error);
        throw error;
    }
};

export const fetchListItems = async (listID) => {
    try {
        const db = await getDbConnection();
        const records = await db.getAllAsync('SELECT * FROM listItems WHERE listID = ?;', [listID]);
        return {
            rows: {
                _array: records,
                length: records.length
            }
        };
    } catch (error) {
        console.error('Failed to fetch child elements for current list:', error);
        throw error;
    }
};

export const deleteListItem = async (id) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM listItems WHERE id = ?;', [id]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to remove isolated item reference:', error);
        throw error;
    }
};

export const deleteAllListItem = async (listID) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM listItems WHERE listID = ?;', [listID]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to delete item collection matrix elements:', error);
        throw error;
    }
};