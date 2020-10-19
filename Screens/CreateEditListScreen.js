import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Dimensions, Alert, KeyboardAvoidingView } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Checkbox from '@react-native-community/checkbox';
import { globalStyles, Colors } from '../Styles/GlobalStyles';
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';
import { createListItem, deleteListItem, fetchListItems, updateListItem } from '../Helper/ListItems';
import * as SQLite from 'expo-sqlite';
import { createList, fetchList, updateList } from '../Helper/Lists';
import { createProperty, fetchProperties, updateProperty, deleteProperty, deleteListProperties } from '../Helper/Properties';
import { createListItemProperty, deleteAllListItemProperties, deleteAllListItemPropertiesbyItemID, deleteAllListItemPropertiesbyPropertyID } from '../Helper/listItemProperty';
import CustomButton from '../Components/CustomButton';


class CreateEditListScreen extends Component {

    state = {
        listItems: [],
        listType: this.props.navigation.getParam('listType'),
        listName: '',
        mode: this.props.navigation.getParam('mode'),
        listItemName: '',
        listProperties: [],
        sliderValueVisible: false,
        db: SQLite.openDatabase('SelectSwitch.db'),
        listID: this.props.navigation.getParam('listID'),
        loaded: false,
        deletedListItems: [],
        deletedListProperties: []
    }


    componentDidMount = async () => {
        // console.log(Dimensions.get('screen').width)
        if (this.state.mode === 'edit') {
            const db = this.state.db

            let list = await fetchList(this.state.listID)
            list = list.rows._array[0]
            this.setState({
                listName: list.listName,
                listType: list.listType,
            })

            let listItems = await fetchListItems(this.state.listID)
            listItems = listItems.rows._array
            this.setState({
                listItems: listItems
            })

            if (this.state.listType === 'logical') {
                let listProperties = await fetchProperties(this.state.listID)
                listProperties = listProperties.rows._array
                let fetchedListProperties = this.state.listProperties
                for (var i = 0; i < listProperties.length; i++) {
                    const newProperty = {
                        propertyName: listProperties[i].propertyName,
                        importance: listProperties[i].importance,
                        info: listProperties[i].info,
                        negative: listProperties[i].negative,
                        id: listProperties[i].id
                    }
                    fetchedListProperties.push(newProperty)
                }
                this.setState({
                    listProperties: fetchedListProperties
                })
            }

        }
        this.setState({
            loaded: true
        })
        // this.addPropertyHandler()
    }

    sliderValueHandler = (event, index) => {
        const listProperties = this.state.listProperties
        listProperties[index].importance = parseInt(event)
        this.setState({
            listProperties: listProperties
        })
    }

    negativeValueToggle = (index) => {
        console.log(index)
        const listProperties = this.state.listProperties
        listProperties[index].negative = listProperties[index].negative === 0 ? 1 : 0
        this.setState({
            listProperties: listProperties
        })
    }

    listNameValueHandler = (event) => {
        this.setState({
            listName: event
        })
    }

    listItemNameHandler = (event) => {
        // console.log(event)
        this.setState({
            listItemName: event
        })
    }

    listItemSubmitHandler = async () => {
        const listItems = this.state.listItems
        const newItem = this.state.listItemName
        // const list
        if (newItem === '') {
            // this.validationAlert('Error!', "List Item Can't be empty")

            return
        }

        listItems.push({
            itemName: newItem,
            id: new Date()
        })
        this.setState({
            listItems: listItems,
            listItemName: ''
        })


    }

    listItemDeleteHandler = (id) => {
        const listItems = this.state.listItems
        let index
        for (var i = 0; i < listItems.length; i++) {
            if (listItems[i].id === id) {
                index = i
            }
        }
        Alert.alert(
            'Delete this item?',
            listItems[index].value,
            [
                {
                    text: "Cancel",
                    onPress: () => confirm = false,
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        if (typeof listItems[index].id === 'number') {
                            const deletedListItems = this.state.deletedListItems
                            deletedListItems.push(listItems[index].id)
                            this.setState({
                                deletedListItems: deletedListItems
                            })
                        }
                        listItems.splice(index, 1)
                        this.setState({
                            listItems: listItems
                        })
                    }
                }
            ],
            { cancelable: true }
        );
    }

    addPropertyHandler = () => {
        const listProperties = this.state.listProperties
        for (var i = 0; i < listProperties.length; i++) {
            if (listProperties[i].propertyName === '') {
                return
            }
        }
        // return
        const newProperty = {
            propertyName: '',
            importance: 20,
            info: '',
            negative: false,
            id: new Date()
        }
        listProperties.push(newProperty)
        this.setState({
            listProperties: listProperties
        })
    }

    propertyNameChangeHandler = (index, event) => {
        const listProperties = this.state.listProperties
        listProperties[index].propertyName = event
        this.setState({
            listProperties: listProperties
        })
    }

    propertyInfoChangeHandler = (index, event) => {
        const listProperties = this.state.listProperties
        listProperties[index].info = event
        this.setState({
            listProperties: listProperties
        })
    }

    propertyDeleteHandler = async (index) => {
        const listProperties = this.state.listProperties
        Alert.alert(
            'Delete this property?',
            listProperties[index].propertyName,
            [
                {
                    text: "Cancel",
                    onPress: () => confirm = false,
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        if (typeof listProperties[index].id === 'number') {
                            const deletedListProperties = this.state.deletedListProperties
                            deletedListProperties.push(listProperties[index].id)
                            this.setState({
                                deletedListProperties: deletedListProperties
                            })
                        }
                        listProperties.splice(index, 1)
                        this.setState({
                            listProperties: listProperties
                        })
                    }
                }
            ],
            { cancelable: true }
        );
    }

    infoAlertHandler = (type) => {
        let text,desc
        if(type === "importance" ){
            text = "About Factor"
            desc="How important is this property, more the importance more the priority"
        }else if(type === "negative"){
            console.log(type)
            text = "About Factor"
            desc="Decides if this a negative property, if set to negative more the importance less the priority"
        }
        Alert.alert(
            text,
            desc,
            [
                {
                    text: "OK",
                    style: "cancel"
                },
            ],
            { cancelable: true }
        );
    }

    validationAlert = (heading, text) => {
        console.log(heading,text)
        Alert.alert(
            heading,
            text,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK"
                }
            ],
            { cancelable: true }
        );
    }

    submitHandler = async () => {

        const listName = this.state.listName
        const listItems = this.state.listItems
        const listProperties = this.state.listProperties
        const listType = this.state.listType
        const db = SQLite.openDatabase('SelectSwitch.db')
        const deletedListItems = this.state.deletedListItems
        const deletedListProperties = this.state.deletedListProperties

        //Validations
        if (listName === '') {
            this.validationAlert('Error!', "List Name Can't be blank")
            return
        }

        if (listType === 'logical') {

            if (listProperties.length === 0) {
                this.validationAlert('Error!', "Properties Can't be empty")
                return
            }
            for (var i = 0; i < listProperties.length; i++) {
                if (listProperties[i].propertyName === '') {
                    this.validationAlert('Error!', "Property Name Can't be blank")
                    return
                }
            }
        }


        if (listItems.length === 0) {
            this.validationAlert('Error!', "List Items Can't be empty")
            return
        }
        //Validations End

        if (this.state.mode === 'create') {

            const listRes = await createList(listName, listType, true, true)
            const listID = listRes.insertId
            // console.log(listItems,listProperties)
            for (var i = 0; i < listItems.length; i++) {
                const itemRes = await createListItem(listID, listItems[i].itemName)
                listItems[i].id = itemRes.insertId
            }
            // return
            if (this.state.listType === 'logical') {
                for (var i = 0; i < listProperties.length; i++) {
                    const propertyRes = await createProperty(listID,
                        listProperties[i].propertyName,
                        listProperties[i].importance,
                        listProperties[i].info,
                        listProperties[i].negative ? 1 : 0
                    )
                    listProperties[i].id = propertyRes.insertId
                }
            }
            // console.log(listItems,listProperties)
            for (var i = 0; i < listItems.length; i++) {
                for (var j = 0; j < listProperties.length; j++) {
                    const res = await createListItemProperty(listItems[i].id, listProperties[j].id, listID, 100)
                    console.log(res)
                }
            }
            // return
            this.props.navigation.pop()
            this.props.navigation.pop()
            this.props.navigation.navigate({
                routeName: 'SelectList', params: {
                    listType: this.state.listType
                }
            })

        }
        else {
            await updateList(listName, this.state.listID)
            for (var i = 0; i < deletedListItems.length; i++) {
                await deleteListItem(deletedListItems[i])
                await deleteAllListItemPropertiesbyItemID(deletedListItems[i])
            }
            for (var i = 0; i < listItems.length; i++) {
                if (typeof listItems[i].id !== "number") {
                    const itemRes = await createListItem(this.state.listID, listItems[i].itemName)
                    // listItems[i].id = itemRes.insertId
                }
            }
            if (this.state.listType === 'logical') {
                for (var i = 0; i < deletedListProperties.length; i++) {
                    const delRes = await deleteProperty(deletedListProperties[i])
                    // console.log(delRes)
                    await deleteAllListItemPropertiesbyPropertyID(deletedListProperties[i])
                }
                for (var i = 0; i < listProperties.length; i++) {
                    if (typeof listProperties[i].id === "number") {
                        const propertyRes = await updateProperty(
                            listProperties[i].propertyName,
                            listProperties[i].importance,
                            listProperties[i].info,
                            listProperties[i].negative ? 1 : 0,
                            listProperties[i].id
                        )
                    } else {
                        const propertyRes = await createProperty(this.state.listID,
                            listProperties[i].propertyName,
                            listProperties[i].importance,
                            listProperties[i].info,
                            listProperties[i].negative ? 1 : 0
                        )
                        listProperties[i].id = propertyRes.insertId
                    }
                }

                const delRes = await deleteAllListItemProperties(this.state.listID)
                // this.changeRoute()
                for (var i = 0; i < listItems.length; i++) {
                    for (var j = 0; j < listProperties.length; j++) {
                        const res = await createListItemProperty(listItems[i].id, listProperties[j].id, this.state.listID, 100)
                    }
                }
            }

            this.props.navigation.pop()
            this.props.navigation.pop()
            this.props.navigation.navigate({
                routeName: 'Result', params: {
                    listName: this.state.listName,
                    listType: this.state.listType,
                    id: this.state.listID,
                }
            })
        }



    }
    changeRoute = () => {
        this.props.navigation.pop()
        this.props.navigation.pop()
        console.log("delRes")
        this.props.navigation.navigate({
            routeName: 'Result', params: {
                listName: this.state.listName,
                listType: this.state.listType,
                id: this.state.listID,
            }
        })
    }


    render() {
        return (
            this.state.loaded
                ?
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        <TextInput placeholder={"List Name"} placeholderTextColor='#2f2f2f' style={styles.listNameInput} onChangeText={this.listNameValueHandler} value={this.state.listName} />

                        {this.state.listType === 'logical'
                            ?
                            <View>
                                <Text style={globalStyles.heading}>Properties</Text>

                                {this.state.listProperties.map((item, index) => {
                                    // console.log(item)
                                    return (
                                        <View style={{ marginTop: 20, marginBottom: 40 }, { ...globalStyles.card }} key={item.id}>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <TextInput placeholder="Camera"
                                                    placeholderTextColor='#707070'
                                                    style={styles.textInput}
                                                    value={this.state.listProperties[index].propertyName}
                                                    onChangeText={this.propertyNameChangeHandler.bind(this, index)}
                                                />
                                                <TouchableOpacity style={styles.propertyDeleteIcon}>
                                                    <MaterialIcons name="delete" size={30} color={Colors.red} onPress={() => this.propertyDeleteHandler(index)} />
                                                </TouchableOpacity>
                                            </View>
                                            {/* <View style={{ flexDirection: 'row' }}>
                                                <TextInput placeholder="Info"
                                                placeholderTextColor='#707070'
                                                style={styles.textInput}
                                                value={this.state.listProperties[index].info}
                                                onChangeText={this.propertyInfoChangeHandler.bind(this, index)}
                                                />
                                            </View> */}
                                            <View style={styles.importanceInput}>
                                                <Text style={styles.sliderText}>Importance</Text>
                                                <AntDesign name="infocirlce" size={16} color="white" onPress={() => this.infoAlertHandler("importance")} style={{ textAlignVertical: 'center' }} />
                                                <Slider
                                                    style={{ height: 55, flex: 4, width: 100 }}
                                                    minimumValue={0}
                                                    maximumValue={100}
                                                    minimumTrackTintColor={Colors.orange}
                                                    maximumTrackTintColor="#333"
                                                    thumbTintColor={Colors.orange}
                                                    onValueChange={(event) => this.sliderValueHandler(event, index)}
                                                    value={this.state.listProperties[index].importance}
                                                    onSlidingStart={() => this.setState({ sliderValueVisible: true })}
                                                    onSlidingComplete={() => this.setState({ sliderValueVisible: false })}
                                                />
                                                <Text style={styles.sliderValue}>{this.state.sliderValueVisible ? this.state.listProperties[index].importance : null}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 20 }}>
                                                <Text style={styles.sliderText}>Negative Value</Text>
                                                <AntDesign name="infocirlce" size={16} color="white" onPress={() => this.infoAlertHandler("negative")} style={{ textAlignVertical: 'center', flex: 2.8 }} />
                                                <Checkbox
                                                    value={item.negative === 0 ? false : true}
                                                    onValueChange={this.negativeValueToggle.bind(this, index)}
                                                    style={styles.checkbox}
                                                    tintColors={{ true: '#FF7043' }}
                                                />
                                            </View>
                                        </View>
                                    )
                                })}

                                <TouchableOpacity>
                                    <AntDesign name="pluscircle" size={30} color="#FF7043" style={{ textAlign: 'center', marginVertical: 10 }} onPress={this.addPropertyHandler} />
                                </TouchableOpacity>
                            </View>


                            : null}


                        <View style={styles.listItemInputContainer}>
                            <TextInput placeholder={"List Item"} placeholderTextColor='#2f2f2f' style={styles.textInput} value={this.state.listItemName} onChangeText={this.listItemNameHandler} />
                            <TouchableOpacity>
                                <AntDesign name="pluscircle" size={30} color="#FF7043" style={styles.plusIcon} onPress={this.listItemSubmitHandler} />
                            </TouchableOpacity>
                        </View>

                        <View style={globalStyles.card} >
                            {this.state.listItems.length > 0
                                ?
                                <Text style={globalStyles.heading}>Current List</Text>
                                : null}
                            {this.state.listItems.map(item => {
                                return (
                                    <View style={styles.currentListItem} key={item.id}>
                                        <FontAwesome name="circle" size={10} color="white" style={{ textAlignVertical: 'center' }} />
                                        <Text style={styles.currentListText}>{item.itemName}</Text>
                                        <MaterialIcons name="delete" size={22} style={styles.currentListDeleteIcon} color={Colors.red} onPress={() => this.listItemDeleteHandler(item.id)} />
                                    </View>
                                )
                            })}
                        </View>
                        <View style={{marginTop:20}}>
                            <CustomButton text="Save"
                                Press={() => {
                                    this.submitHandler()
                                }}
                                marginVertical={10}
                                style={{ marginTop: 20, flex: 1, justifyContent: 'center' }}
                                marginHorizontal={Dimensions.get('screen').width < 350 ? 10 : 20}
                            />
                            <CustomButton text="Cancel"
                                Press={() => {
                                    this.props.navigation.goBack()
                                }}
                                style={{ marginTop: 20, flex: 1, justifyContent: 'center' }}
                                marginHorizontal={Dimensions.get('screen').width < 350 ? 10 : 20}
                            />
                        </View>
                    </ScrollView>
                    {/* <KeyboardAvoidingView> */}
                    {/* </KeyboardAvoidingView> */}
                </View>
                : null
        )
    }
}

CreateEditListScreen.navigationOptions = (navData) => {
    const mode = navData.navigation.getParam('mode')
    const listType = navData.navigation.getParam('listType')
    return {
        headerTitle: mode === 'create' ? 'Create List' : 'Edit List',
        headerLeft: () => (
            <View style={styles.backIcon} >
                <Ionicons name="md-arrow-back" size={24} color="white" onPress={() => {
                    if (mode === 'create') {
                        navData.navigation.navigate({
                            routeName: 'SelectList', params: {
                                listType: listType
                            }
                        })
                    } else {
                        navData.navigation.goBack()

                    }

                }
                }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717'
    },
    listNameInput: {
        color: 'white',
        fontSize: 20,
        marginTop: Dimensions.get('screen').width < 350 ? 10 : 40,
        marginHorizontal: Dimensions.get('screen').width < 350 ? 10 : 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    textInput: {
        color: 'white',
        fontSize: 20,
        marginTop: 10,
        marginHorizontal: Dimensions.get('screen').width < 350 ? 10 : 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10,
        width: Dimensions.get('screen').width < 350 ? 250 : 310,
        flex: 3
    },
    listItemInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    plusIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 20,
        marginRight: Dimensions.get('screen').width < 350 ? 10 : 20,

    },
    currentListItem: {
        marginLeft: 10,
        marginVertical: 10,
        flexDirection: 'row',
    },
    currentListText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 10
    },
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#171717",
        display: 'flex'
    },
    propertyDeleteIcon: {
        marginTop: 10,
        marginRight: Dimensions.get('screen').width < 350 ? 5 : 10,
    },
    currentListDeleteIcon: {
        textAlignVertical: 'center',
        textAlign: 'right',
        flex: 1,
        marginRight: Dimensions.get('screen').width < 350 ? 5 : 10,
        justifyContent: 'center'
    },
    sliderText: {
        color: '#fff',
        fontSize: 20,
        textAlignVertical: 'center',
        marginLeft: Dimensions.get('screen').width < 350 ? 10 : 20,
        flex: 2.3,
        // marginRight: Dimensions.get('screen').width < 350 ? 10 : 20,
    },
    sliderValue: {
        // fontSize: 20,
        color: '#fff',
        textAlignVertical: 'center',
        flex: 1,
        marginRight: Dimensions.get('screen').width < 350 ? 10 : 25
    },
    importanceInput: {
        flexDirection: 'row',
        width: Dimensions.get('screen').width < 350 ? 320 : 410,
        flex: 1
    },
    checkbox: {
        marginRight: Dimensions.get('screen').width < 350 ? 5 : 10

    },
    backIcon: {
        marginLeft: Dimensions.get('screen').width < 350 ? 10 : 20
    }
})




const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => {
    return {
        handleRandomListCreate: (listName, listItems) => dispatch({ type: 'CREATE_RANDOM_LIST', listName: listName, listItems: listItems })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditListScreen)
