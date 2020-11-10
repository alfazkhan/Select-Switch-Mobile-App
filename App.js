// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import SelectSwitchNavigator from './Navigation/SelectSwitchNavigator';
import { createStore } from 'redux';
import { countReducer } from './Redux/Reducers/MainReducer';
import { Provider } from 'react-redux';
import { init } from './Helper/db';
import { Component } from 'react';


let store = createStore(countReducer);


export default class App extends Component {

state={
  show:false
}
componentDidMount=async()=> {
  await init()
  // await seedData()
  this.setState({show:true})
}


  render() {

    return (

      <Provider store={store}>
        {this.state.show
          ?
          <SelectSwitchNavigator>
            <StatusBar backgroundColor="black" barStyle={'light-content'} />
          </SelectSwitchNavigator>
          : null}
      </Provider>


    );
  }
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
