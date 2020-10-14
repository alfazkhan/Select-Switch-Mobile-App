import React, { Component } from 'react'
import { View, Button, StatusBar, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import * as Svg from 'react-native-svg';




class StartScreen extends Component {


    render() {
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor="black" barStyle={'light-content'} />


                <Button title="Random Choice" onPress={() => {
                    this.props.navigation.navigate({
                        routeName: 'SelectList', params: {
                            listType: 'random'
                        }
                    })
                }} />

                {/* <Svg height="50%" width="50%" viewBox="0 0 249 48" >
                    <defs>
                        <linearGradient
                            id="a"
                            x1="124.5"
                            x2="124.5"
                            y2="48"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#fff" />
                            <stop offset="0.00738" stop-color="#f6f6f6" />
                            <stop offset="0.04768" stop-color="#c8c8c8" />
                            <stop offset="0.09309" stop-color="#9d9d9d" />
                            <stop offset="0.1419" stop-color="#777" />
                            <stop offset="0.19502" stop-color="#575757" />
                            <stop offset="0.25374" stop-color="#3b3b3b" />
                            <stop offset="0.32001" stop-color="#252525" />
                            <stop offset="0.39742" stop-color="#141414" />
                            <stop offset="0.49311" stop-color="#090909" />
                            <stop offset="0.62736" stop-color="#020202" />
                            <stop offset="1" />
                        </linearGradient>
                    </defs>
                    <title>RandomButton</title>
                    <rect class="a" width="249" height="48" rx="3" />
                    <text class="b" transform="translate(55.80664 31.9995)">
                        RANDOM CHOICE
      </text>
                </Svg> */}



                <Button title="Logical Choice" onPress={() => {
                    this.props.navigation.navigate({
                        routeName: 'SelectList', params: {
                            listType: 'logical'
                        }
                    })
                }} />
            </View>
        )
    }
}

StartScreen.navigationOptions = () => {

}

const styles = StyleSheet.create({
    button: {
        color: '#fff',
        textAlign: 'center'
    },
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#171717",
        display: 'flex'
    }
})




export default StartScreen