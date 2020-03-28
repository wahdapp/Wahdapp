import React, { useEffect } from 'react';
import { ExpoConfigView } from '@expo/samples';
import { auth } from 'firebaseDB';

export default function SettingsScreen() {
  useEffect(() => {
    auth.signOut() ;
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
