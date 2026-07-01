import { db } from './dbInstance';

export const createResult = (listID, result) => {
    const operationResult = db.execute(
        'INSERT INTO results (listID, result) VALUES (?, ?);',
        [listID, result]
    );
    return {
        insertId: operationResult.insertId,
        rowsAffected: operationResult.rowsAffected
    };
};

export const fetchResult = (listID) => {
    const result = db.execute(
        'SELECT * FROM results WHERE listID = ? ORDER BY id DESC LIMIT 10;',
        [listID]
    );
    return {
        rows: {
            _array: result.rows?._array ?? [],
            length: result.rows?.length ?? 0
        }
    };
};

export const deleteResults = (listID) => {
    const operationResult = db.execute('DELETE FROM results WHERE listID = ?;', [listID]);
    return { rowsAffected: operationResult.rowsAffected };
};