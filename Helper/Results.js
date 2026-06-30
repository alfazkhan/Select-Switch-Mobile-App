import { getDbConnection } from './dbInstance';

export const createResult = async (listID, result) => {
    try {
        const db = await getDbConnection();
        const operationResult = await db.runAsync(
            'INSERT INTO results (listID, result) VALUES (?, ?);',
            [listID, result]
        );
        return {
            insertId: operationResult.lastInsertRowId,
            rowsAffected: operationResult.changes
        };
    } catch (error) {
        console.error('Failed to cache historical selection element result:', error);
        throw error;
    }
};

export const fetchResult = async (listID) => {
    try {
        const db = await getDbConnection();
        const records = await db.getAllAsync(
            'SELECT * FROM results WHERE listID = ? ORDER BY id DESC LIMIT 10;',
            [listID]
        );
        return {
            rows: {
                _array: records,
                length: records.length
            }
        };
    } catch (error) {
        console.error('Failed to gather dynamic score record metrics array history:', error);
        throw error;
    }
};

export const deleteResults = async (listID) => {
    try {
        const db = await getDbConnection();
        const operationResult = await db.runAsync('DELETE FROM results WHERE listID = ?;', [listID]);
        return { rowsAffected: operationResult.changes };
    } catch (error) {
        console.error('Failed to discard result record items collections matching targets:', error);
        throw error;
    }
};