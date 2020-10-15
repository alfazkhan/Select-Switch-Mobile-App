import React, { Component } from 'react'
import { View, Button, StatusBar, Image, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import CustomButton from '../Components/CustomButton'



class StartScreen extends Component {


    render() {
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor="black" barStyle={'light-content'} />

                    <CustomButton
                        text="Random Choice"
                        Press={() => {
                            console.log("object")
                            this.props.navigation.navigate({
                                routeName: 'SelectList', params: {
                                    listType: 'random'
                                }
                            })
                        }}
                        height={40}
                        width={Dimensions.get('screen').width/2}
                        style={{marginVertical: 20}}
                    />

                    <CustomButton
                        text="Logical Choice"
                        Press={() => {
                            console.log("object")
                            this.props.navigation.navigate({
                                routeName: 'SelectList', params: {
                                    listType: 'logical'
                                }
                            })
                        }}
                        height={40}
                        width={Dimensions.get('screen').width/2}
                    />

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