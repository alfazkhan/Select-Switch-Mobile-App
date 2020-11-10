import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')

export const createProperty = (listID, propertyName,importance,negative) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO properties (listID, propertyName,importance,negative) VALUES(?,?,?,?)`,
                [listID, propertyName,importance,negative],
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

export const updateProperty = (propertyName,importance,negative,id) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`UPDATE properties SET propertyName=?,importance=?,negative=? where id=?`,
                [propertyName,importance,negative,id],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
}

export const deleteProperty = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE from properties  where id=?`,
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
}

export const deleteListProperties = (listID) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE from properties  where listID=?`,
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
}