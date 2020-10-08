import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Dimensions } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
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
        sliderValue: 0
    }


    componentDidMount() {
        // console.log(Dimensions.get('screen').width)
        const listType = this.props.navigation.getParam('listType')
        this.setState({
            listItems: [
                { key: '1', value: 'Apple' },
                { key: '2', value: 'Ball' },
                { key: '3', value: 'Cat' },
            ],
            listType: listType
        })
    }

    sliderValueHandler = (event) => {
        // console.log(parseInt(event))
        this.setState({
            sliderValue: parseInt(event)
        })
    }



    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput placeholder={"List Name"} placeholderTextColor='#ffffff' style={styles.listNameInput} />

                {this.state.listType === 'logical'
                    ?
                    <View>
                        <Text style={globalStyles.heading}>Properties</Text>
                        <View style={{ marginTop: 20, marginBottom: 40 }, { ...globalStyles.card }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput placeholder="Camera" placeholderTextColor='#fff' style={styles.textInput} />
                                <MaterialIcons name="delete" size={30} style={styles.propertyDeleteIcon} color={Colors.red} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput placeholder="Property Info" placeholderTextColor='#fff' style={styles.textInput} />
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
                                    onValueChange={this.sliderValueHandler}
                                // value={this.state.sliderValue}
                                />
                                <Text style={styles.sliderValue}>{this.state.sliderValue}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={styles.sliderText}>Negative Value</Text>
                                <Checkbox
                                    // value={isSelected}
                                    // onValueChange={setSelection}
                                    style={styles.checkbox}
                                    tintColors={{ true: '#FF7043' }}
                                />
                            </View>
                        </View>
                        <View>
                            <AntDesign name="pluscircle" size={30} color="#FF7043" style={{ textAlign: 'center', marginVertical: 10 }} />
                        </View>
                    </View>
                    : null}


                <View style={styles.listItemInputContainer}>
                    <TextInput placeholder={"List Item"} placeholderTextColor='#ffffff' style={styles.textInput} />
                    <AntDesign name="pluscircle" size={30} color="#FF7043" style={styles.plusIcon} />
                </View>

                <View style={globalStyles.card}>
                    <Text style={globalStyles.heading}>Current List</Text>
                    {this.state.listItems.map(item => {
                        return (
                            <View style={styles.currentListItem}>
                                <FontAwesome name="circle" size={10} color="white" style={{ textAlignVertical: 'center' }} onPress={this.addItem} />
                                <Text style={styles.currentListText}>{item.value}</Text>
                                <MaterialIcons name="delete" size={22} style={styles.currentListDeleteIcon} color={Colors.red} />
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
        fontSize: 20,
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