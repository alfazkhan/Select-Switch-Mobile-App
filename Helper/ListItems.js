import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')

export const createListItem = (listID, itemName) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO listItems (listID,itemName) VALUES(?,?)`,
                [listID,itemName],
                (_,result) => {
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


}

export const deleteListItem = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM listItems where id=?`,
                [id],
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

