import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
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

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [firstUse, setFirstUse] = useState(false);
  const [isRetrievalComplete, setIsRetrievalComplete] = useState(false);

  useEffect(() => {
    checkFirstUse();
  }, []);

  async function checkFirstUse() {
    try {
      const user = await AsyncStorage.getItem('user');
      console.log({ user })
      if (!user) {
        setFirstUse(true);
      }
      setIsRetrievalComplete(true);
    }
    catch (e) {
      throw e;
    }
  }

  const handleSelectGender = (gender) => () => {
    AsyncStorage.setItem('user', JSON.stringify({ gender }));
    setFirstUse(false);
  }

  if (!isLoadingComplete && !props.skipLoadingScreen || !isRetrievalComplete) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    if (firstUse) {
      return (
        <View style={styles.genderSelectionContainer}>
          <TouchableOpacity style={styles.woman} onPress={handleSelectGender("F")}>
            <View>
              <Text>Woman</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.man} onPress={handleSelectGender("M")}>
            <View>
              <Text>Man</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
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
  woman: {
    width: '50%',
    backgroundColor: '#ea6ecd'
  },
  man: {
    width: '50%',
    backgroundColor: '#50a1b7'
  }
});
