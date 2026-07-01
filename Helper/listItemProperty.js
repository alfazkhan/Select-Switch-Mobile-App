import { db } from './dbInstance';

export const createListItemProperty = (listItemID, propertyID, listID, value) => {
    const result = db.execute(
        'INSERT INTO listItemProperty (listItemID, propertyID, listID, value) VALUES (?, ?, ?, ?);',
        [listItemID, propertyID, listID, value]
    );
    return {
        insertId: result.insertId,
        rowsAffected: result.rowsAffected
    };
};

export const fetchListItemProperty = (listID) => {
    const result = db.execute('SELECT * FROM listItemProperty WHERE listID = ?;', [listID]);
    return {
        rows: {
            _array: result.rows?._array ?? [],
            length: result.rows?.length ?? 0
        }
    };
};

export const deleteAllListItemProperties = (listID) => {
    const result = db.execute('DELETE FROM listItemProperty WHERE listID = ?;', [listID]);
    return { rowsAffected: result.rowsAffected };
};

export const deleteAllListItemPropertiesbyItemID = (listItemID) => {
    const result = db.execute('DELETE FROM listItemProperty WHERE listItemID = ?;', [listItemID]);
    return { rowsAffected: result.rowsAffected };
};

export const deleteAllListItemPropertiesbyPropertyID = (propertyID) => {
    const result = db.execute('DELETE FROM listItemProperty WHERE propertyID = ?;', [propertyID]);
    return { rowsAffected: result.rowsAffected };
};