import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')

export const createListItemProperty = (listItemID, propertyID,listID, value) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO listItemProperty (listItemID,propertyID,listID, value) VALUES(?,?,?,?)`,
                [listItemID, propertyID,listID, value],
                (_, result) => {
                    resolve(result)
                    console.log(result)
                },
                (_, err) => {
                    reject(err)
                    console.log(err)
                }
            )
        })
    })
    return promise
}

export const fetchListItemProperty = (listID) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`SELECT * FROM listItemProperty where listID=?`,
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



export const deleteAllListItem = (listID) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItems where listID=?`,
                [listID],
                (_, result) => {

                    console.log(result)

                },
                (_, err) => {
                    console.log(err)
                }
            )
        })
    })


}

