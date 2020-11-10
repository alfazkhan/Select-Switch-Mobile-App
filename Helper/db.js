import * as SQLite from 'expo-sqlite';
import { fetchAllList, createList, deleteAllList } from './Lists';
import { createListItem } from './ListItems';
import { createListItemProperty } from './listItemProperty';
import { createProperty } from './Properties';


const db = SQLite.openDatabase('SelectSwitch.db')


export const init = async () => {
    const promise = new Promise(async (resolve, reject) => {
        await initialiseList()
        await createListItems()
        await createProperties()
        await createListItemProperties()
        await createResults()
        await initialiseData()
        resolve()
    })
    return promise
}

export const initialiseList = () => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql('CREATE TABLE IF NOT EXISTS lists (id INTEGER NOT NULL PRIMARY KEY, listName TEXT NOT NULL, listType TEXT NOT NULL, repeatResults INTEGER NOT NULL, storeResults INTEGER NOT NULL);',
                [],
                (_, result) => {

                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                    console.log(err)
                }
            )
        })
    })
}

export const createListItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql('CREATE TABLE IF NOT EXISTS listItems (id INTEGER NOT NULL PRIMARY KEY, listID INTEGER NOT NULL, itemName TEXT NOT NULL);',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                })
        })
    })
}

export const createProperties = () => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql('CREATE TABLE IF NOT EXISTS properties (id INTEGER NOT NULL PRIMARY KEY,listID INTEGER NOT NULL, propertyName TEXT NOT NULL, importance INTEGER NOT NULL, negative INTEGER NOT NULL);',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                })
        })
    })
}

export const createListItemProperties = () => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql('CREATE TABLE IF NOT EXISTS listItemProperty (id INTEGER NOT NULL PRIMARY KEY, listItemID INTEGER NOT NULL,listID INTEGER NOT NULL, propertyID INTEGER NOT NULL, value INTEGER NOT NULL);',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                })
        })
    })
}

export const createResults = () => {
    return new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql('CREATE TABLE IF NOT EXISTS results (id INTEGER NOT NULL PRIMARY KEY, listID INTEGER NOT NULL, result TEXT NOT NULL);',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                })
        })
    })
}

export const initialiseData = () => {
    return new Promise(async (resolve, reject) => {
        const res = await fetchAllList()
        if (res.rows._array.length === 0) {
            let randomID = await createList("Breakfast", "random", 1, 1)
            randomID = randomID.insertId
            let logicalID = await createList("Lunch", "logical", 1, 1)
            logicalID = logicalID.insertId
            const listItems = ["Poha", "Burger", "Rice"]
            const IDs = [randomID, logicalID]
            const listItemIDs = []
            for (let i = 0; i < IDs.length; i++) {
                for (let j = 0; j < listItems.length; j++) {
                    let listItemID = await createListItem(IDs[i], listItems[j])
                    if (IDs[i] === logicalID) {
                        listItemIDs.push(listItemID.insertId)
                    }
                }
            }

            const property = ["Taste","Calories"]
            const propertyIds = []
            for (let i = 0; i < 2; i++) {
                const propertyID = await createProperty(logicalID, property[i], Math.floor(Math.random() * 100), i)
                propertyIds.push(propertyID.insertId)
            }

            for (let i = 0; i < listItemIDs.length; i++) {
                for (let j = 0; j < propertyIds.length; j++) {
                    await createListItemProperty(listItemIDs[i], propertyIds[j], logicalID, 100)
                }
            }


            // await deleteAllList()
        }
        resolve()
    })
}

