import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')

export const createListItem = (listID, itemName) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO listItems (listID,itemName) VALUES(?,?)`,
                [listID, itemName],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
    return promise


}

export const fetchListItems = (listID) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`SELECT * FROM listItems where listID=?`,
                [listID],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })

    return promise
}

export const deleteListItem = (id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItems where id=?`,
                [id],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })

    return promise
}

export const deleteAllListItem = (listID) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItems where listID=?`,
                [listID],
                (_, result) => {
                    resolve(result)

                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })

    return promise
}

