import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Root } from "native-base";
import { auth } from 'firebaseDB';
import store from './store';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import LoginScreen from 'screens/Auth/LoginScreen';
import SignupScreen from 'screens/Auth/SignupScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppNavigator from './navigation/AppNavigator';
import { decode, encode } from 'base-64'

/* Firebase bug */
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    getLocationPermission();
    authenticateUser();
  }, []);

  function authenticateUser() {
    auth.onAuthStateChanged(user => {
      setIsAuthenticating(false);
      console.log({ user })
      setUserAuth(user);
    });
  }

  async function getLocationPermission() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log({ status })
    if (status !== 'granted') {
      alert("Please enable your location for the best experience!");
    }
  }

  if (!isLoadingComplete && !props.skipLoadingScreen || isAuthenticating) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }

  if (!userAuth) {
    return (
      <Root>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: '' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Root>
    )
  }

  return (
    <Root>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <Provider store={store}>
          <AppNavigator user={userAuth} />
        </Provider>
      </View>
    </Root>
  );
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      'Roboto': require('./assets/fonts/Sen-Regular.ttf'),
      'Roboto_medium': require('./assets/fonts/Sen-Bold.ttf'),
      'Sen': require('./assets/fonts/Sen-Regular.ttf'),
      'Sen-Bold': require('./assets/fonts/Sen-Bold.ttf'),
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/Sen-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  genderSelectionContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    height: ScreenHeight,
    width: ScreenWidth
  },
});
