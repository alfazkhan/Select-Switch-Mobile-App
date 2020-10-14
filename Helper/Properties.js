import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')

export const createProperty = (listID, propertyName,importance,info,negative) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO properties (listID, propertyName,importance,info,negative) VALUES(?,?,?,?,?)`,
                [listID, propertyName,importance,info,negative],
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

export const fetchProperties = (listID) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`SELECT * from properties where listID=?`,
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

export const updateList = (listName, id) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`UPDATE lists SET listName=? where id=?`,
                [listName, id],
                (_, result) => {
                    resolve(result)
                    console.log('Data Inserted')
                },
                (_, err) => {
                    reject(err)
                    console.log(err)
                }
            )
        })
    })
}