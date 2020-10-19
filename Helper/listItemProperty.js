import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')

export const createListItemProperty = (listItemID, propertyID,listID, value) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO listItemProperty (listItemID,propertyID,listID, value) VALUES(?,?,?,?)`,
                [listItemID, propertyID,listID, value],
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



export const deleteAllListItemProperties = (listID) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItemProperty where listID=?`,
                [listID],
                (_, result) => {
                    resolve(result)
                    // console.log(result)

                },
                (_, err) => {
                    reject(err)
                    // console.log(err)
                }
            )
        })
    })
}
export const deleteAllListItemPropertiesbyItemID = (listItemID) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItemProperty where listItemID=?`,
                [listItemID],
                (_, result) => {
                    resolve(result)
                    // console.log(result)

                },
                (_, err) => {
                    reject(err)
                    // console.log(err)
                }
            )
        })
    })
}
export const deleteAllListItemPropertiesbyPropertyID = (propertyID) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItemProperty where propertyID=?`,
                [propertyID],
                (_, result) => {
                    resolve(result)
                    // console.log(result)

                },
                (_, err) => {
                    reject(err)
                    // console.log(err)
                }
            )
        })
    })
}

