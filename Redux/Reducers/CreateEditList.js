
export const createRandomList = (listName, listItems) => {
    const newList = {
        listName: listName,
        listType: 'random',
        repeatResults: true,
        storeResults: true
    }


    for (var i = 0; i < listItems; i++) {
        listItems.push({
            listId: 1,
            itemName: listItems[i].value
        })
    }

    return ([newList, listItems])
}