import { db } from './dbInstance';

export const createProperty = (listID, propertyName, importance, negative) => {
    const result = db.execute(
        'INSERT INTO properties (listID, propertyName, importance, negative) VALUES (?, ?, ?, ?);',
        [listID, propertyName, importance, negative]
    );
    return {
        insertId: result.insertId,
        rowsAffected: result.rowsAffected
    };
};

export const fetchProperties = (listID) => {
    const result = db.execute('SELECT * FROM properties WHERE listID = ?;', [listID]);
    return {
        rows: {
            _array: result.rows?._array ?? [],
            length: result.rows?.length ?? 0
        }
    };
};

export const updateProperty = (propertyName, importance, negative, id) => {
    const result = db.execute(
        'UPDATE properties SET propertyName = ?, importance = ?, negative = ? WHERE id = ?;',
        [propertyName, importance, negative, id]
    );
    return { rowsAffected: result.rowsAffected };
};

export const deleteProperty = (id) => {
    const result = db.execute('DELETE FROM properties WHERE id = ?;', [id]);
    return { rowsAffected: result.rowsAffected };
};

export const deleteListProperties = (listID) => {
    const result = db.execute('DELETE FROM properties WHERE listID = ?;', [listID]);
    return { rowsAffected: result.rowsAffected };
};