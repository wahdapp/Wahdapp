import * as Permissions from 'expo-permissions';
import { Alert, Linking } from 'react-native';

export const askPermissions = async () => {
  try {
    // Check user's permission statuses on notification & location
    const { status: notifStat } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    const { status: locationStat } = await Permissions.getAsync(Permissions.LOCATION);

    if (notifStat !== 'granted' || locationStat !== 'granted') throw new Error('');
  } catch (e) {
    throw e;
  }
};

export const guideToSettings = () => {
  Alert.alert('Permissions', 'You must grant permissions for notification and location.', [
    {
      text: 'Go to Settings',
      onPress: () =>
        Linking.openURL(
          `app-settings://notification/${__DEV__ ? 'host.exp.Expo' : 'com.aboudicheng.wahdapp'}`
        ),
    },
    { text: 'Back' },
  ]);
};
