import { getDbConnection } from './dbInstance';

export const createListItemProperty = async (listItemID, propertyID, listID, value) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync(
            'INSERT INTO listItemProperty (listItemID, propertyID, listID, value) VALUES (?, ?, ?, ?);',
            [listItemID, propertyID, listID, value]
        );
        return {
            insertId: result.lastInsertRowId,
            rowsAffected: result.changes
        };
    } catch (error) {
        console.error('Failed to bridge row relation intersection maps:', error);
        throw error;
    }
};

export const fetchListItemProperty = async (listID) => {
    try {
        const db = await getDbConnection();
        const records = await db.getAllAsync('SELECT * FROM listItemProperty WHERE listID = ?;', [listID]);
        return {
            rows: {
                _array: records,
                length: records.length
            }
        };
    } catch (error) {
        console.error('Failed to read value relation maps for matching list structure:', error);
        throw error;
    }
};

export const deleteAllListItemProperties = async (listID) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM listItemProperty WHERE listID = ?;', [listID]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to purge configuration records matching current layout context:', error);
        throw error;
    }
};

export const deleteAllListItemPropertiesbyItemID = async (listItemID) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM listItemProperty WHERE listItemID = ?;', [listItemID]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to remove intersection row components by matching item key:', error);
        throw error;
    }
};

export const deleteAllListItemPropertiesbyPropertyID = async (propertyID) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM listItemProperty WHERE propertyID = ?;', [propertyID]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to scrub dynamic weight metrics matching property criteria identifier:', error);
        throw error;
    }
};