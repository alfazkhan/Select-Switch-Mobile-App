import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('SelectSwitch.db')


export const init = () => {
    db.transaction((txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS lists (id INTEGER NOT NULL PRIMARY KEY, listName TEXT NOT NULL, listType TEXT NOT NULL, repeatResults INTEGER NOT NULL, storeResults INTEGER NOT NULL);',
        [],
        ()=>{
            console.log('List table Created')
        },
        (_,err)=>{
            console.log(err)
        }
        )
    })
    db.transaction((txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS listItems (id INTEGER NOT NULL PRIMARY KEY, listID INTEGER NOT NULL, itemName TEXT NOT NULL);',
        [],
        ()=>{
            console.log('List Items table Created')
        },
        (_,err)=>{
            console.log(err)
        })
    })
    db.transaction((txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS properties (id INTEGER NOT NULL PRIMARY KEY,listID INTEGER NOT NULL, propertyName TEXT NOT NULL, importance INTEGER NOT NULL, info TEXT NOT NULL, negative INTEGER NOT NULL);',
        [],
        ()=>{
            console.log('Properties table Created')
        },
        (_,err)=>{
            console.log(err)
        })
    })
    db.transaction((txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS listItemProperty (id INTEGER NOT NULL PRIMARY KEY, listItemID INTEGER NOT NULL,listID INTEGER NOT NULL, propertyID INTEGER NOT NULL, value INTEGER NOT NULL);',
        [],
        ()=>{
            console.log('List Item Properties table Created')
        },
        (_,err)=>{
            console.log(err)
        })
    })
    db.transaction((txn) => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS results (id INTEGER NOT NULL PRIMARY KEY, listID INTEGER NOT NULL, result TEXT NOT NULL);',
        [],
        ()=>{
            console.log('Results table Created')
        },
        (_,err)=>{
            console.log(err)
        })
    })
}