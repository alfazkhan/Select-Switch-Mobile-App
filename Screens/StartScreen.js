import React, { Component } from 'react'
import { View, Button, StatusBar, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'




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