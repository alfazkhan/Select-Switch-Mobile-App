import { db } from './dbInstance';

export const createList = (listName, listType, repeatResults, storeResults) => {
    const result = db.execute(
        'INSERT INTO lists (listName, listType, repeatResults, storeResults) VALUES (?, ?, ?, ?);',
        [listName, listType, repeatResults ? 1 : 0, storeResults ? 1 : 0]
    );
    return {
        insertId: result.insertId,
        rowsAffected: result.rowsAffected
    };
};

export const updateList = (listName, id) => {
    const result = db.execute(
        'UPDATE lists SET listName = ? WHERE id = ?;',
        [listName, id]
    );
    return { rowsAffected: result.rowsAffected };
};

export const fetchList = (id) => {
    const result = db.execute('SELECT * FROM lists WHERE id = ?;', [id]);
    return {
        rows: {
            _array: result.rows?._array ?? [],
            length: result.rows?.length ?? 0
        }
    };
};

export const deleteList = (id) => {
    const result = db.execute('DELETE FROM lists WHERE id = ?;', [id]);
    return { rowsAffected: result.rowsAffected };
};

export const fetchAllList = () => {
    const result = db.execute('SELECT * FROM lists;');
    return {
        rows: {
            _array: result.rows?._array ?? [],
            length: result.rows?.length ?? 0
        }
    };
};

export const deleteAllList = () => {
    const result = db.execute('DELETE FROM lists;');
    return { rowsAffected: result.rowsAffected };
};