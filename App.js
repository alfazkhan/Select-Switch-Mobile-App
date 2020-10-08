// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import SelectSwitchNavigator from './Navigation/SelectSwitchNavigator';

export default function App() {
  return (


    <SelectSwitchNavigator>

      <StatusBar backgroundColor="black" barStyle={'light-content'} />
    </SelectSwitchNavigator>

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
