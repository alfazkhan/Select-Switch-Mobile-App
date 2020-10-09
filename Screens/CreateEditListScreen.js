import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Dimensions, Alert } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Checkbox from '@react-native-community/checkbox';
import { globalStyles, Colors } from '../Styles/GlobalStyles';


export default class CreateEditListScreen extends Component {

    state = {
        listItems: [],
        listType: '',
        listName: '',
        mode: this.props.navigation.getParam('mode'),
        listItemName: '',
        listProperties: [],
        sliderValueVisible:false
    }


    componentDidMount() {
        const listType = this.props.navigation.getParam('listType')
        this.setState({
            listType: listType
        })
    }

    sliderValueHandler = (event,index) => {
        const listProperties = this.state.listProperties
        listProperties[index].importance = parseInt(event)
        this.setState({
            listProperties: listProperties
        })
    }

    negativeValueToggle = (index) =>{
        const listProperties = this.state.listProperties
        listProperties[index].negative = !listProperties[index].negative 
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

    listItemSubmitHandler = () => {
        const listItems = this.state.listItems
        const newItem = this.state.listItemName
        listItems.push({
            value: newItem,
            id: new Date()
        })
        console.log(listItems)
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
                    text: "OK", onPress: () => {

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


    render() {
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
                <TextInput placeholder={"List Name"} placeholderTextColor='#ffffff' style={styles.listNameInput} onChangeText={this.listNameValueHandler} value={this.state.listName} />

                {this.state.listType === 'logical'
                    ?
                    <View>
                        <Text style={globalStyles.heading}>Properties</Text>

                        {this.state.listProperties.map((item, index) => {
                            return (
                                <View style={{ marginTop: 20, marginBottom: 40 }, { ...globalStyles.card }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput placeholder="Camera" placeholderTextColor='#fff' style={styles.textInput} value={this.state.listProperties[index].propertyName} />
                                        <MaterialIcons name="delete" size={30} style={styles.propertyDeleteIcon} color={Colors.red} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput placeholder="Property Info" placeholderTextColor='#fff' style={styles.textInput} value={this.state.listProperties[index].info} />
                                    </View>
                                    <View style={styles.importanceInput}>
                                        <Text style={styles.sliderText}>Importance</Text>

                                        <Slider
                                            style={{ height: 55, flex: 4, width: 100 }}
                                            minimumValue={0}
                                            maximumValue={100}
                                            minimumTrackTintColor={Colors.orange}
                                            maximumTrackTintColor="#333"
                                            thumbTintColor={Colors.orange}
                                            onValueChange={(event)=>this.sliderValueHandler(event,index)}
                                            value={this.state.listProperties[index].importance}
                                            onSlidingStart={()=>this.setState({sliderValueVisible:true})}
                                            onSlidingComplete={()=>this.setState({sliderValueVisible:false})}
                                        />
                                        <Text style={styles.sliderValue}>{this.state.sliderValueVisible?this.state.listProperties[index].importance:null}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={styles.sliderText}>Negative Value</Text>
                                        <Checkbox
                                            value={this.state.listProperties[index].negative}
                                            onValueChange={this.negativeValueToggle.bind(this,index)}
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
                    <TextInput placeholder={"List Item"} placeholderTextColor='#ffffff' style={styles.textInput} value={this.state.listItemName} onChangeText={this.listItemNameHandler} />
                    <TouchableOpacity>
                        <AntDesign name="pluscircle" size={30} color="#FF7043" style={styles.plusIcon} onPress={this.listItemSubmitHandler} />
                    </TouchableOpacity>
                </View>

                <View style={globalStyles.card}>
                    <Text style={globalStyles.heading}>Current List</Text>
                    {this.state.listItems.map(item => {
                        return (
                            <View style={styles.currentListItem} key={item.id}>
                                <FontAwesome name="circle" size={10} color="white" style={{ textAlignVertical: 'center' }} onPress={this.addItem} />
                                <Text style={styles.currentListText}>{item.value}</Text>
                                <MaterialIcons name="delete" size={22} style={styles.currentListDeleteIcon} color={Colors.red} onPress={() => this.listItemDeleteHandler(item.id)} />
                            </View>
                        )
                    })}
                </View>
                <View style={styles.root}>
                    <Button title="Save" />
                    <Button title="Cancel" />
                </View>
            </ScrollView>
        )
    }
}

CreateEditListScreen.navigationOptions = (navData) => {
    const mode = navData.navigation.getParam('mode')
    return {
        headerTitle: mode === 'create' ? 'Create List' : 'Edit List'
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
        marginTop: 50,
        marginHorizontal: Dimensions.get('screen').width < 400 ? 10 : 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    textInput: {
        color: 'white',
        fontSize: 20,
        marginTop: 10,
        marginHorizontal: Dimensions.get('screen').width < 400 ? 10 : 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10,
        width: Dimensions.get('screen').width < 400 ? 240 : 300
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
        marginRight: Dimensions.get('screen').width < 400 ? 10 : 20,

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
        textAlignVertical: 'center',
        textAlign: 'right',
        flex: 1,
        marginRight: Dimensions.get('screen').width < 400 ? 5 : 10
    },
    currentListDeleteIcon: {
        textAlignVertical: 'center',
        textAlign: 'right',
        flex: 1,
        paddingRight: Dimensions.get('screen').width < 400 ? 5 : 15
    },
    sliderText: {
        color: '#fff',
        fontSize: 20,
        textAlignVertical: 'center',
        marginLeft: Dimensions.get('screen').width < 400 ? 10 : 20,
        flex: 3
    },
    sliderValue: {
        // fontSize: 20,
        color: '#fff',
        textAlignVertical: 'center',
        flex: 1,
        marginRight: Dimensions.get('screen').width < 400 ? 5 : 15
    },
    importanceInput: {
        flexDirection: 'row',
        width: Dimensions.get('screen').width < 400 ? 320 : 410,
        flex: 1
    },
    checkbox: {
        marginRight: Dimensions.get('screen').width < 400 ? 5 : 10

    }
})