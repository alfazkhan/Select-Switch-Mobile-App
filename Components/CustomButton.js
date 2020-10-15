import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity } from 'react-native'
import GradientButton from 'react-native-gradient-buttons'

export default class CustomButton extends Component {
    press=()=>{
        console.log("object")
    }
    render() {
        return (
            <View style={{}}  >
                <TouchableOpacity>
                    <GradientButton
                        style={{...this.props.style}}
                        text={this.props.text}
                        textStyle={{ fontSize: 16 }}
                        gradientBegin="#fff"
                        gradientEnd="#000"
                        gradientDirection="vertical"
                        height={this.props.height}
                        width={this.props.width}
                        radius={5}
                        impact={false}
                        impactStyle='Light'
                        onPressAction={this.props.Press}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}
