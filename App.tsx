import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import { auth } from '@/firebase';
import store from './store';
import { SnackbarProvider } from '@/contexts/snackbar';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import '@/helpers/clearTimer';
import './i18n';
import * as Sentry from 'sentry-expo';
import { getLatLong } from './helpers/geo';
import { askPermissions, guideToSettings } from './helpers/permission';

// Enable sentry in production
if (!__DEV__) {
  Sentry.init({
    dsn: 'https://1c85f06f0e814e3f862b9204f5bb07ba@o374179.ingest.sentry.io/5191762',
    enableInExpoDevelopment: false,
    debug: false,
  });
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userAuth, setUserAuth] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    try {
      askPermissions();
    } catch (e) {
      guideToSettings();
    }
    authenticateUser();
  }, []);

  function authenticateUser() {
    auth.onAuthStateChanged((user) => {
      setIsAuthenticating(false);
      setUserAuth(user);
    });
  }

  async function loadResourcesAsync() {
    await Font.loadAsync({
      Sen: require('./assets/fonts/Sen-Regular.ttf'),
      SenBold: require('./assets/fonts/Sen-Bold.ttf'),
      ...Feather.font,
    });

    try {
      const pos = await getLatLong();
      console.log({ pos });
      setPosition(pos);
    } catch (e) {
      console.log('Error while getting position');
    }
  }

  if ((!isLoadingComplete && !props.skipLoadingScreen) || isAuthenticating) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => setLoadingComplete(true)}
      />
    );
  }

  return (
    <SnackbarProvider>
      <Root>
        <ActionSheetProvider>
          <Provider store={store}>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <Provider store={store}>
                <AppNavigator user={userAuth} position={position} />
              </Provider>
            </View>
          </Provider>
        </ActionSheetProvider>
      </Root>
    </SnackbarProvider>
  );
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
  Sentry.captureException(error);
}

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  genderSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    height: ScreenHeight,
    width: ScreenWidth,
  },
});
