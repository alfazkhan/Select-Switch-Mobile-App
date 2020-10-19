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
                            this.props.navigation.navigate({
                                routeName: 'SelectList', params: {
                                    listType: 'random'
                                }
                            })
                        }}
                        // height={Dimensions.get('screen').width < 350 ? 40 :50}
                        width={Dimensions.get('screen').width/1.5}
                        marginVertical= {10}
                    />

                    <CustomButton
                        text="Logical Choice"
                        Press={() => {
                            this.props.navigation.navigate({
                                routeName: 'SelectList', params: {
                                    listType: 'logical'
                                }
                            })
                        }}
                        // height={Dimensions.get('screen').width < 350 ? 40 :50}
                        width={Dimensions.get('screen').width/1.5}
                    />


            </View>
        )
    }
}

StartScreen.navigationOptions = () => {

}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        textAlign: 'center',
        borderColor: 'white',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        
    },
    buttonText:{
        color: '#FFD700',
        fontWeight:'bold'
    }
    ,
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#171717",
        display: 'flex'
    }
})




export default StartScreen