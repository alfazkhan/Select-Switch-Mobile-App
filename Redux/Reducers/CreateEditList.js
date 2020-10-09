import { createList } from "../../Helper/Lists"

export const createRandomList = async (listName, listItems) => {
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

    // console.log(listName,listItems)

    const create = await createList(listName,'random',1,1)
    console.log(create)


    return ([newList, listItems])
}