import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Alert, Button } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Colors, globalStyles } from '../Styles/GlobalStyles'
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Checkbox from '@react-native-community/checkbox';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { connect } from 'react-redux'
import { deleteAllListItem, fetchListItems } from '../Helper/ListItems';
import { deleteAllListItemProperties, fetchListItemProperty } from '../Helper/listItemProperty';
import { deleteListProperties, fetchProperties } from '../Helper/Properties';
import { createResult, fetchResult, deleteResults } from '../Helper/Results';

import {
    AdMobBanner,

    setTestDeviceIDAsync,
} from 'expo-ads-admob';
import { deleteList, fetchList } from '../Helper/Lists';
setTestDeviceIDAsync('EMULATOR');


class ResultScreen extends Component {

    state = {
        listType: this.props.navigation.getParam('listType'),
        currentListItems: [],
        result: 'RESULT',
        listProperties: [],
        propertyCollpse: [],
        sliderValueVisible: false,
        storeResults: null,
        repeatResults: null,
        previousResults: [],
        listID: this.props.navigation.getParam('id'),
        loaded: false,
        db: SQLite.openDatabase('SelectSwitch.db'),
        listItemProperties: {}

    }

    componentDidMount = async () => {
        //fetchListItems

        let list = await fetchList(this.state.listID)
        list = list.rows._array[0]
        this.setState({
            storeResults: list.storeResults === 1 ? true : false,
            repeatResults: list.repeatResults === 1 ? true : false
        })
        // console.log(list.storeResults)
        // console.log(list.storeResults === 1 ? true : false)

        let listItems = await fetchListItems(this.state.listID)
        listItems = listItems.rows._array
        // console.log(listItems)
        const propertyCollpse = []
        for (var i = 0; i < listItems.length; i++) {
            propertyCollpse[i] = false
        }
        this.setState({
            currentListItems: listItems,
            propertyCollpse: propertyCollpse
        })

        //fetch Results
        let results = await fetchResult(this.state.listID)
        results = results.rows._array
        const previousResults = []
        for (var i = 0; i < results.length; i++) {
            previousResults[i] = results[i].result
        }
        this.setState({
            previousResults: previousResults
        })

        if (this.state.listType === 'logical') {
            //fetchlistItemproperty
            let result = await fetchListItemProperty(this.state.listID)
            result = result.rows._array
            
            const itemProperties = this.state.listItemProperties
            for (var i = 0; i < result.length; i++) {
                const tempArray = []
                itemProperties[result[i].listItemID] = tempArray

            }

            for (var i = 0; i < result.length; i++) {
                const tempArray = itemProperties[result[i].listItemID]
                tempArray.push(result[i].value)
                itemProperties[result[i].listItemID] = tempArray

            }
            console.log(itemProperties)
            this.setState({
                listItemProperties: itemProperties
            })
            //fetchProperties
            let properties = await fetchProperties(this.state.listID)
            properties = properties.rows._array
            this.setState({
                listProperties: properties
            })
        }



        this.setState({

            loaded: true
        })
    }

    infoAlertHandler = (index) => {
        Alert.alert(
            'About Property',
            this.state.listProperties[index].info,
            [
                { text: 'OK' }
            ],
            { cancelable: true }
        );
    }

    propertyCollapseToggle = (index) => {
        const propertyCollpse = this.state.propertyCollpse
        for (var i = 0; i < propertyCollpse.length; i++) {
            if (i === index) {
                propertyCollpse[i] = !propertyCollpse[i]
            } else {
                propertyCollpse[i] = false
            }
        }
        this.setState({
            propertyCollpse: propertyCollpse
        })
    }

    propertyValueChangeHandler = (value, itemID, propertyIndex) => {
        const listItemProperties = this.state.listItemProperties
        listItemProperties[itemID][propertyIndex] = parseInt(value)
        this.setState({
            listItemProperties: listItemProperties
        })
    }

    repeatResultsToggle = () => {
        const db = this.state.db
        db.transaction((txn) => {
            txn.executeSql(`UPDATE lists SET repeatResults = ${!this.state.repeatResults ? 1 : 0} where id=${this.state.listID}`,
                [],
                (_, result) => {
                    console.log(result)
                    this.setState({
                        repeatResults: !this.state.repeatResults
                    })
                },
                (_, err) => {
                    console.log(err)
                }
            )
        })

    }

    storeResultsToggle = () => {
        const db = this.state.db
        db.transaction((txn) => {
            txn.executeSql(`UPDATE lists SET storeResults = ${!this.state.storeResults ? 1 : 0} where id=${this.state.listID}`,
                [],
                (_, result) => {
                    console.log(result)
                    this.setState({
                        storeResults: !this.state.storeResults
                    })
                },
                (_, err) => {
                    console.log(err)
                }
            )
        })


    }

    calculateRandomResult = async () => {

        const currentListItems = this.state.currentListItems
        const randomIndex = parseInt(Math.random() * currentListItems.length)
        const result = currentListItems[randomIndex].itemName

        const previousResults = this.state.previousResults
        if (this.state.storeResults) {
            if (previousResults.length > 10) {
                previousResults.pop()
            }
            previousResults.unshift(result)
            this.setState({
                previousResults: previousResults
            })
            await createResult(this.state.listID, result)
        }

        if (!this.state.repeatResults) {
            currentListItems.splice(randomIndex, 1)
        }

        this.setState({
            result: result
        })

    }

    calculateLogicalResult = () => {
        //(100-NegativeValue)*importance + PositiveValue*importance
        const currentListItems = this.state.currentListItems
        const listItemProperties = this.state.listItemProperties
        const listProperties = this.state.listProperties
        const sumValues = []
        for (var i = 0; i < currentListItems.length; i++) {
            let sum = 0
            for (var j = 0; j < listProperties.length; j++) {
                if (listProperties[j].negative) {
                    sum += (100 - listItemProperties[currentListItems[i].id][j]) * listProperties[j].importance
                } else {
                    sum += listItemProperties[currentListItems[i].id][j] * listProperties[j].importance
                }
            }
            sumValues.push(sum)
        }
        const result = currentListItems[this.maxElementIndex(sumValues)].itemName
        const previousResults = this.state.previousResults
        if (this.state.storeResults) {
            if (previousResults.length > 10) {
                previousResults.pop()
            }
            previousResults.unshift(result)
            createResult(this.state.listID, result)
        }
        this.setState({
            previousResults: previousResults,
            result: result
        })

    }

    maxElementIndex = (array) => {
        let maxIndex
        const max = Math.max.apply(null, array)
        for (var i = 0; i < array.length; i++) {
            max === array[i] ? maxIndex = i : null
        }
        return maxIndex
    }

    

    render() {
        const listItems = this.state.currentListItems.map((item, index) => {
            // console.log(item)
            // return
            return (
                <View key={item.id}>
                    <View style={styles.propertyContainer}>
                        <FontAwesome name="circle" size={10} color="white" style={{ textAlignVertical: 'center' }} />
                        <Text style={styles.propertyNameText}>{item.itemName}</Text>
                        {this.state.listType === 'logical'
                            ?
                            <AntDesign
                                name={this.state.propertyCollpse[index] ? "up" : "down"}
                                size={24}
                                color="white"
                                style={{ textAlignVertical: 'center' }}
                                onPress={() => this.propertyCollapseToggle(index)}
                            />
                            : null}

                    </View>
                    <View>

                        {this.state.listType === 'logical' && this.state.propertyCollpse[index]
                            ?
                            this.state.listProperties.map((prop, propIndex) => {
                                // return
                                const listItemProperties = this.state.listItemProperties

                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20, marginVertical: 10 }} key={prop.id}>
                                        <Text style={{ color: '#fff', flex: 2.5, fontSize: 16, marginLeft: Dimensions.get('screen').width < 400 ? 25 : 35 }}>{prop.propertyName}</Text>
                                        <Slider
                                            style={{ height: 25, width: 50, flex: 5 }}
                                            minimumValue={0}
                                            maximumValue={100}
                                            minimumTrackTintColor={prop.negative ? Colors.red : Colors.green}
                                            maximumTrackTintColor="#333"
                                            thumbTintColor={prop.negative ? Colors.red : Colors.green}
                                            value={this.state.listItemProperties[item.id][propIndex]}
                                            onValueChange={(value) => this.propertyValueChangeHandler(value, item.id, propIndex)}
                                            onSlidingStart={() => this.setState({ sliderValueVisible: true })}
                                            onSlidingComplete={() => this.setState({ sliderValueVisible: false })}
                                        />
                                        {this.state.sliderValueVisible
                                            ?
                                            <Text style={{ flex: 1, textAlignVertical: 'center', color: '#fff' }}>{this.state.listItemProperties[item.id][propIndex]}</Text>
                                            :
                                            <Text style={{ flex: 1, textAlignVertical: 'center', color: '#fff' }}></Text>
                                        }
                                    </View>
                                )

                            })
                            : null
                        }
                    </View>
                </View>
            )
        })
        return (
            this.state.loaded
                ?
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.root}>

                        <View style={styles.resultcard}>
                            <Text style={styles.heading}>{this.state.result}</Text>
                        </View>
                        <View style={globalStyles.card}>
                            <Text style={globalStyles.heading}>Current List</Text>
                            {listItems}
                        </View>
                        <View style={styles.optionsCard}>
                            {this.state.listType === 'random'
                                ?
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.optionsText}>Repeat Results</Text>
                                        <Checkbox
                                            style={styles.checkbox}
                                            tintColors={{ true: '#FF7043' }}
                                            value={this.state.repeatResults}
                                            onChange={this.repeatResultsToggle}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.settingInfoText}>Repeat previously occured Results</Text>
                                    </View>
                                </View>
                                : null}
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.optionsText}>{"Store Results"}</Text>
                                    <Checkbox
                                        style={styles.checkbox}
                                        tintColors={{ true: '#FF7043' }}
                                        value={this.state.storeResults}
                                        onChange={this.storeResultsToggle}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.settingInfoText}>Store Previous 10 Results</Text>
                                </View>
                            </View>
                        </View>

                        <View style={globalStyles.card}>
                            <Text style={globalStyles.heading} >Results</Text>
                            <Text style={styles.propertyNameText}>{this.state.previousResults.toString()}</Text>


                        </View>

                    </ScrollView>
                    <View style={{ width: Dimensions.get('window').width }}>
                        <AdMobBanner
                            bannerSize="fullBanner"
                            adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                            servePersonalizedAds // true or false
                            onDidFailToReceiveAdWithError={this.bannerError}
                            style={{ width: Dimensions.get('window').width }}
                        />
                    </View>
                    <View >
                        {this.state.currentListItems.length !== 0
                            ?
                            <TouchableOpacity
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: '#FF7043',
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    // top:10,
                                    flex: 1
                                }}
                                onPress={
                                    this.state.listType === 'random'
                                        ? this.calculateRandomResult
                                        : this.calculateLogicalResult
                                }
                            >
                                <Entypo name="shuffle" style={{ textAlignVertical: 'center', textAlign: 'center', flex: 1 }} size={40} color='#fff' />

                            </TouchableOpacity>
                            : null}
                    </View>
                </View>
                : <View style={{ flex: 1 }}></View>

        )
    }
}

ResultScreen.navigationOptions = (navData) => {
    const listName = navData.navigation.getParam('listName')
    const listID = navData.navigation.getParam('id')
    const listType = navData.navigation.getParam('listType')
    // console.log(navData)
    return {
        headerTitle: listName,
        headerRight: () => (
            <View style={styles.iconContainer}>
                <MaterialIcons
                    style={{ textAlignVertical: 'center', textAlign: 'center', flex: 1 }}
                    name="edit"
                    size={24}
                    color="white"
                    onPress={() => {

                        navData.navigation.navigate({
                            routeName: 'CreateEdit', params: {
                                listID: listID,
                                mode: 'edit',
                                listType: listType
                            }
                        })
                    }
                    } />
                <MaterialIcons
                    style={{ textAlignVertical: 'center', textAlign: 'center', flex: 1, marginHorizontal: 20 }}
                    name="delete"
                    size={24}
                    color="white"
                    onPress={() => {
                        Alert.alert(
                            'Delete List',
                            'Are you sure you want to delete this list?',
                            [
                                { text: 'Cancel' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        // return
                                        await deleteList(listID)

                                        await deleteResults(listID)
                                        await deleteAllListItem(listID)

                                        if (listType === 'logical') {
                                            await deleteAllListItemProperties(listID)
                                            await deleteListProperties(listID)
                                        }
                                        navData.navigation.popToTop({
                                            params: {
                                                listType: listType
                                            }
                                        })
                                        console.log(navData.navigation.getParam('listType'))
                                        navData.navigation.navigate({
                                            routeName: 'SelectList',
                                            params: {
                                                listType: listType
                                            }
                                        })

                                    }
                                },
                            ],
                            { cancelable: true }
                        );
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        color: '#fff',
        textAlign: 'center'
    },
    root: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: "#171717",
        display: 'flex'
    },
    resultcard: {
        ...globalStyles.card,
        height: 100,
        justifyContent: 'center',
    },
    heading: {
        ...globalStyles.heading,
        textAlignVertical: 'center',
        marginTop: 0

    },
    propertyNameText: {
        color: '#fff',
        fontSize: 22,
        marginHorizontal: 25,
        marginVertical: 10,
        flex: 5
    },
    propertyContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: Dimensions.get('screen').width < 400 ? 10 : 20,

    },
    optionsText: {
        color: '#fff',
        fontSize: 20,
        textAlignVertical: 'center',
        marginLeft: Dimensions.get('screen').width < 400 ? 10 : 20,
        flex: 3,
    },
    optionsCard: {
        ...globalStyles.card,
        paddingVertical: 5
    },
    checkbox: {
        marginRight: Dimensions.get('screen').width < 400 ? 5 : 10

    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    floatButton: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 10,
        zIndex: 6

    },
    iconContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    settingInfoText: {
        color: 'grey',
        fontSize: 12,
        textAlignVertical: 'center',
        marginLeft: Dimensions.get('screen').width < 400 ? 10 : 20,
    }
})



const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return {
        handleIncrementClick: () => dispatch({ type: 'INCREMENT' }),
        handleDecrementClick: () => dispatch({ type: 'DECREMENT' })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen)
