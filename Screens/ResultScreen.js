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
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
} from 'expo-ads-admob';
setTestDeviceIDAsync('EMULATOR');


class ResultScreen extends Component {

    state = {
        listType: this.props.navigation.getParam('listType'),
        currentListItems: [],
        result: 'RESULT',
        listProperties: [],
        propertyCollpse: [],
        sliderValueVisible: false,
        storeResults: false,
        repeatResults: false,
        previousResults: []

    }

    componentDidMount() {
        //fetchListItems
        let listItems = []
        let listProperties = []
        if (this.state.listType === 'random') {
            listItems = ['Poha', 'Pizza', 'Samosa']

        } else {
            listItems = [
                {
                    listItem: 'Nokia',
                    properties: [30, 70, 40]
                },
                {
                    listItem: 'Samsung',
                    properties: [90, 80, 60]
                },
                {
                    listItem: 'iPhone',
                    properties: [100, 50, 95]
                }
            ]
            listProperties = [
                {
                    propertyName: 'Camera',
                    importance: 70,
                    info: 'How good is Camera',
                    negative: false
                },
                {
                    propertyName: 'Looks',
                    importance: 30,
                    info: 'How phone looks',
                    negative: false
                },
                {
                    propertyName: 'Price',
                    importance: 100,
                    info: 'What is the cost of phone',
                    negative: true
                },
            ]
        }

        const propertyCollpse = []
        for (var i = 0; i < listItems.length; i++) {
            propertyCollpse[i] = false
        }

        const repeatResults = true
        const storeResults = true

        this.setState({
            currentListItems: listItems,
            listProperties: listProperties,
            propertyCollpse: propertyCollpse,
            repeatResults: repeatResults,
            storeResults: storeResults
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

    propertyValuceChangeHandler = (value, itemIndex, propertyIndex) => {

        const listItems = this.state.currentListItems
        listItems[itemIndex].properties[propertyIndex] = parseInt(value)
        this.setState({
            currentListItems: listItems
        })
    }

    repeatResultsToggle = () => {
        this.setState({
            repeatResults: !this.state.repeatResults
        })
    }

    storeResultsToggle = () => {

        this.setState({
            storeResults: !this.state.storeResults
        })
    }

    calculateRandomResult = () => {

        const currentListItems = this.state.currentListItems
        const randomIndex = parseInt(Math.random() * currentListItems.length)
        const result = currentListItems[randomIndex]

        const previousResults = this.state.previousResults
        if (this.state.storeResults) {
            if (previousResults.length < 10) {
                previousResults.unshift(result)
            } else {
                previousResults.pop()
                previousResults.unshift(result)
            }
            this.setState({
                previousResults: previousResults
            })
        }
        this.setState({
            result: result
        })

    }

    calculateLogicalResult = () => {
        // (100 - property1Value) * importance + property2Value * importance
        const currentListItems = this.state.currentListItems
        const listProperties = this.state.listProperties
        const resultArray = []
        for (var i = 0; i < currentListItems.length; i++) {
            const score = 0
            for (var j = 0; j < listProperties.length; j++) {
                score += listProperties[j].negative ? (100 - currentListItems[i].properties[j]) * listProperties[j].importance : currentListItems[i].properties[j] * listProperties[j].importance
            }
            resultArray.push(score)
        }
        const result = currentListItems[this.maxElementIndex(resultArray)].listItem
        const previousResults = this.state.previousResults
        if (this.state.storeResults) {
            if (previousResults.length < 10) {
                previousResults.unshift(result)
            } else {
                previousResults.pop()
                previousResults.unshift(result)
            }
            this.setState({
                previousResults: previousResults
            })
        }
        this.setState({
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
            return (
                <View>
                    <View style={styles.propertyContainer}>
                        <FontAwesome name="circle" size={10} color="white" style={{ textAlignVertical: 'center' }} />
                        <Text style={styles.propertyNameText}>{this.state.listType === 'random' ? item : item.listItem}</Text>
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
                                return (

                                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20, marginVertical: 10 }}>
                                        <Text style={{ color: '#fff', flex: 2, fontSize: 16, marginLeft: Dimensions.get('screen').width < 400 ? 25 : 35 }}>{prop.propertyName}</Text>

                                        <Slider
                                            style={{ height: 25, width: 50, flex: 5 }}
                                            minimumValue={0}
                                            maximumValue={100}
                                            minimumTrackTintColor={prop.negative ? Colors.red : Colors.green}
                                            maximumTrackTintColor="#333"
                                            thumbTintColor={prop.negative ? Colors.red : Colors.green}
                                            value={item.properties[propIndex]}
                                            onValueChange={(value) => this.propertyValuceChangeHandler(value, index, propIndex)}
                                            onSlidingStart={() => this.setState({ sliderValueVisible: true })}
                                            onSlidingComplete={() => this.setState({ sliderValueVisible: false })}
                                        />
                                        {this.state.sliderValueVisible
                                            ?
                                            <Text style={{ flex: 1, textAlignVertical: 'center', color: '#fff' }}>{item.properties[propIndex]}</Text>
                                            :
                                            <AntDesign name="infocirlce" size={16} color="white" onPress={() => this.infoAlertHandler(index)} style={{ flex: 1, textAlignVertical: 'center' }} />
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
                                <Text style={styles.optionsText}>Store Results</Text>
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
                        <Button title="Click Me" onPress={this.props.handleIncrementClick} />

                        <Text style={styles.propertyNameText}>{this.state.previousResults.toString()}</Text>


                    </View>
                    <View style={globalStyles.card}>
                        <AdMobBanner
                            bannerSize="fullBanner"
                            adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                            servePersonalizedAds // true or false
                            onDidFailToReceiveAdWithError={this.bannerError} />
                    </View>


                </ScrollView>
                <View  >
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
                        onPress={this.state.listType === 'random' ? this.calculateRandomResult : this.calculateLogicalResult}
                    >
                        <Entypo name="shuffle" style={{ textAlignVertical: 'center', textAlign: 'center', flex: 1 }} size={40} color='#fff' />

                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}

ResultScreen.navigationOptions = (navData) => {
    const listName = navData.navigation.getParam('listName')
    return {
        headerTitle: listName,
        headerRight: () => (
            <View style={styles.iconContainer}>
                <MaterialIcons style={{ textAlignVertical: 'center', textAlign: 'center', flex: 1 }} name="edit" size={24} color="white" onPress={() => navData.navigation.navigate({ routeName: 'CreateEdit' })} />
                <MaterialIcons style={{ textAlignVertical: 'center', textAlign: 'center', flex: 1, marginHorizontal: 20 }} name="delete" size={24} color="white" />
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
        flex: 3
    },
    optionsCard: {
        ...globalStyles.card,
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

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return {
        handleIncrementClick: () => dispatch({ type: 'INCREMENT' }),
        handleDecrementClick: () => dispatch({ type: 'DECREMENT' })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen)
