import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';
import { getLatLong } from './geo';

export const askPermissions = async () => {
  // check user's permission statuses on notification & location
  try {
    const { status: currentStat } = await Location.getPermissionsAsync();
    const { status: locationStat } = await Location.requestPermissionsAsync();
    if (locationStat !== 'granted') throw new Error('');

    // When the user gives permission after the popup, get user's location again
    const pos = await getLatLong();
    return pos;
  } catch (e) {
    guideToSettings();
  }

  // do not force the user to turn on notification permission
  try {
    await Notifications.requestPermissionsAsync();
  } catch (e) {
    return null;
  }
};

export const guideToSettings = () => {
  Alert.alert('Permissions', 'You must grant permissions for notification and location.', [
    {
      text: 'Go to Settings',
      onPress: () => {
        const bundleIdentifier = __DEV__ ? 'host.exp.Expo' : 'com.aboudicheng.wahdapp';
        if (Platform.OS === 'ios') {
          Linking.openURL(`app-settings://notification/${bundleIdentifier}`);
        } else {
          Linking.openSettings();
        }
      },
    },
    { text: 'Back' },
  ]);
};
