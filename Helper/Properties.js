import { getDbConnection } from './dbInstance';

export const createProperty = async (listID, propertyName, importance, negative) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync(
            'INSERT INTO properties (listID, propertyName, importance, negative) VALUES (?, ?, ?, ?);',
            [listID, propertyName, importance, negative]
        );
        return {
            insertId: result.lastInsertRowId,
            rowsAffected: result.changes
        };
    } catch (error) {
        console.error('Failed to create target factor property configuration:', error);
        throw error;
    }
};

export const fetchProperties = async (listID) => {
    try {
        const db = await getDbConnection();
        const records = await db.getAllAsync('SELECT * FROM properties WHERE listID = ?;', [listID]);
        return {
            rows: {
                _array: records,
                length: records.length
            }
        };
    } catch (error) {
        console.error('Failed to extract active evaluation weights:', error);
        throw error;
    }
};

export const updateProperty = async (propertyName, importance, negative, id) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync(
            'UPDATE properties SET propertyName = ?, importance = ?, negative = ? WHERE id = ?;',
            [propertyName, importance, negative, id]
        );
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to update scalar property matrix row:', error);
        throw error;
    }
};

export const deleteProperty = async (id) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM properties WHERE id = ?;', [id]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to drop column logic condition:', error);
        throw error;
    }
};

export const deleteListProperties = async (listID) => {
    try {
        const db = await getDbConnection();
        const result = await db.runAsync('DELETE FROM properties WHERE listID = ?;', [listID]);
        return { rowsAffected: result.changes };
    } catch (error) {
        console.error('Failed to clear factors linked to target list layout:', error);
        throw error;
    }
};