import { useFonts } from 'expo-font';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { askPermissions } from './helpers/permission';
import * as SplashScreen from 'expo-splash-screen';

// Enable sentry in production
if (!__DEV__) {
  Sentry.init({
    dsn: 'https://1c85f06f0e814e3f862b9204f5bb07ba@o374179.ingest.sentry.io/5191762',
    enableInExpoDevelopment: false,
    debug: false,
  });
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Sen: require('./assets/fonts/Sen-Regular.ttf'),
    SenBold: require('./assets/fonts/Sen-Bold.ttf'),
    ...Feather.font,
  });

  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userAuth, setUserAuth] = useState(null);
  const [position, setPosition] = useState(null);

  const isCompleted = useMemo(() => fontsLoaded && isLoadingComplete && !isAuthenticating, [
    fontsLoaded,
    isLoadingComplete,
    isAuthenticating,
  ]);

  const onLayoutRootView = useCallback(async () => {
    if (isCompleted) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isCompleted]);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await loadResourcesAsync();
      } catch (e) {
        await SplashScreen.hideAsync();
        handleLoadingError(e);
      } finally {
        // Tell the application to render
        setLoadingComplete(true);
      }
    }

    authenticateUser();
    prepare();
  }, []);

  useEffect(() => {
    if (isCompleted) {
      // If asking permission immediately after being ready, the screen
      // gets stuck on the splash screen for some reason. Instead, the
      // application asks the permissions 1.5 seconds after the application
      // gets ready.
      setTimeout(async () => {
        try {
          const result = await askPermissions();
          if (result) {
            setPosition(result);
          }
        } catch (e) {
          return;
        }
      }, 1500);
    }
  }, [isCompleted]);

  function authenticateUser() {
    auth.onAuthStateChanged((user) => {
      setIsAuthenticating(false);
      setUserAuth(user);
    });
  }

  async function loadResourcesAsync() {
    try {
      const pos = await getLatLong();
      setPosition(pos);
    } catch (e) {
      console.log('Error while getting position');
    }
  }

  if (!isCompleted) {
    return null;
  }

  return (
    <SnackbarProvider>
      <Root>
        <ActionSheetProvider>
          <Provider store={store}>
            <View style={styles.container} onLayout={onLayoutRootView}>
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
