import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { countReducer } from '../Redux/Reducers/MainReducer';
import { init } from '../Helper/db';

const store = createStore(countReducer);

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

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepareDatabase() {
      try {
        await init();
      } catch (e) {
        console.warn("Database initialization failed:", e);
      } finally {
        setIsReady(true);
      }
    }
    prepareDatabase();
  }, []);

  if (!isReady) {
    return null; 
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Stack screenOptions={{ ...defaultNavOptions }}>
          <Stack.Screen name="index" options={{ headerShown: true }} />
          <Stack.Screen name="SelectList" options={{ headerShown: true }} />
          <Stack.Screen name="CreateEdit" options={{ headerShown: true }} />
          <Stack.Screen name="Result" options={{ headerShown: true }} />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});