import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelectListScreen from '../Screens/SelectListScreen';
import StartScreen from '../Screens/StartScreen';
import CreateEditListScreen from '../Screens/CreateEditListScreen';
import ResultScreen from '../Screens/ResultScreen';

const Stack = createStackNavigator();

const defaultNavOptions = {
    headerTitle: '',
    headerTintColor: '#fff',
    headerStyle: {
        backgroundColor: '#000',
    },
    headerTitleStyle: {
        color: '#fff'
    },
};

export default function SelectSwitchNavigator() {
    return (
        <Stack.Navigator 
            initialRouteName="Start"
            screenOptions={{ ...defaultNavOptions }}
        >
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="SelectList" component={SelectListScreen} />
            <Stack.Screen name="CreateEdit" component={CreateEditListScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
    );
}