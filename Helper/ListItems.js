import { db } from './dbInstance';

export const createListItem = (listID, itemName) => {
    const result = db.execute(
        'INSERT INTO listItems (listID, itemName) VALUES (?, ?);',
        [listID, itemName]
    );
    return {
        insertId: result.insertId,
        rowsAffected: result.rowsAffected
    };
};

export const fetchListItems = (listID) => {
    const result = db.execute('SELECT * FROM listItems WHERE listID = ?;', [listID]);
    return {
        rows: {
            _array: result.rows?._array ?? [],
            length: result.rows?.length ?? 0
        }
    };
};

export const deleteListItem = (id) => {
    const result = db.execute('DELETE FROM listItems WHERE id = ?;', [id]);
    return { rowsAffected: result.rowsAffected };
};

export const deleteAllListItem = (listID) => {
    const result = db.execute('DELETE FROM listItems WHERE listID = ?;', [listID]);
    return { rowsAffected: result.rowsAffected };
};