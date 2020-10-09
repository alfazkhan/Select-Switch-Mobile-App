import { createRandomList } from "./CreateEditList";


const initialState = {
    lists: [],
    listsItems: [],
    property: [],
    listsItemProperty: [],
    result: []
}



export const countReducer = function (state = initialState, action) {
    switch (action.type) {
        case "CREATE_RANDOM_LIST":
            createRandomList(action.listName, action.listItems)
                .then((res) => {
                    console.log(res)
                    const lists = initialState.lists
                    const listsItems = initialState.listsItems
                    lists.push(res[0])
                    listsItems.push(res[1])
                    const updatedState = {
                        ...initialState,
                        lists: lists,
                        listsItems: listsItems
                    }
                    //   console.log(updatedState)
                    return updatedState

                })
                .catch(err => {
                    console.log(err)
                })

        case "DECREMENT":
            return state;
        default:
            return state;
    }
};