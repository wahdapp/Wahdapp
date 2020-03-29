import React, { useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { auth } from 'firebaseDB';

export default function SettingsScreen() {
  useEffect(() => {
    auth.signOut();
    AsyncStorage.removeItem('prayersFilter');
  }, []);
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return <ExpoConfigView />;
}

SettingsScreen.navigationOptions = {
  title: 'app.json',
};
