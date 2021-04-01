import * as Permissions from 'expo-permissions';
import { Alert, Linking, Platform } from 'react-native';

export const askPermissions = async () => {
  // check user's permission statuses on notification & location
  try {
    const { status: locationStat } = await Permissions.askAsync(Permissions.LOCATION);
    if (locationStat !== 'granted') throw new Error('');
  } catch (e) {
    throw e;
  }

  // do not force the user to turn on notification permission
  try {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  } catch (e) {
    return;
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
