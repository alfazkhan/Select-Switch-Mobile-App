import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import GradientButton from 'react-native-gradient-buttons'

export default class CustomButton extends Component {

    render() {
        return (
            <TouchableOpacity style={{
                marginVertical: this.props.marginVertical,
                width: this.props.width,
                marginHorizontal: this.props.marginHorizontal,
                height: this.props.height
            }}
                onPress={this.props.Press}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }
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
    buttonText: {
        color: '#E1C773',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18
    }
})