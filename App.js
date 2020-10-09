// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import SelectSwitchNavigator from './Navigation/SelectSwitchNavigator';
import { createStore } from 'redux';
import { countReducer } from './Redux/Reducers/MainReducer';
import { Provider } from 'react-redux';
import { init } from './Helper/db';


let store = createStore(countReducer);


export default function App() {
  init()
  return (

    <Provider store={store}>
      <SelectSwitchNavigator>
        <StatusBar backgroundColor="black" barStyle={'light-content'} />
      </SelectSwitchNavigator>
    </Provider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24
  },
});
