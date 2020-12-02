import React, { useState, useEffect } from 'react';
import { AsyncStorage, Vibration } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getLatLong } from '../helpers/geo';
import { setLocation, setUser, setFilter, setNotificationRedirect } from '../actions';
import { Loader } from '@/components';
import SelectGenderScreen from '@/screens/Auth/SelectGenderScreen';
import MainTabNavigator from './MainTabNavigator';
import { Notifications } from 'expo';
import { getUserInfo } from '@/services/user';
import { getInvitedAmount, getParticipatedAmount, getPrayerByID } from '@/services/prayer';
import i18n from 'i18next';
import { formatLanguage } from '@/helpers/dateFormat';
import { Notification } from 'expo/build/Notifications/Notifications.types';

export default ({ user }) => {
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [isFirstOAuth, setIsFirstOAuth] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    init();

    const listener = Notifications.addListener(handleNotification);

    return () => {
      // unsubscribe listener
      listener.remove();
    };
  }, []);

  async function init() {
    // get user location
    const location = await getLatLong();
    dispatch(setLocation(location));

    await initFilter();

    try {
      // Get user general info
      const userInfo = await getUserInfo(user.uid);

      // Get total invited & participated prayers amount
      const invited = await getInvitedAmount(user.uid);
      const participated = await getParticipatedAmount(user.uid);

      initLanguage(userInfo.locale);
      setIsFirstOAuth(false);
      setUserDataFetched(true);
      dispatch(
        setUser({
          ...userInfo,
          invitedAmount: invited.amount,
          participatedAmount: participated.amount,
        })
      );
    } catch (e) {
      console.log(e);
      // The user just signed in with OAuth
      // Let the user choose his/her gender then create a new document into the database
      setIsFirstOAuth(true);
    }
  }

  async function initLanguage(locale: string) {
    i18n.changeLanguage(locale);
    formatLanguage(locale);
  }

  async function initFilter() {
    const prayersFilter = await AsyncStorage.getItem('prayersFilter');
    if (prayersFilter) {
      dispatch(setFilter(JSON.parse(prayersFilter)));
    }
  }

  async function handleNotification(notification: Notification) {
    if (notification.remote) {
      if (notification.data.id) {
        const prayer = await getPrayerByID(notification.data.id);
        dispatch(setNotificationRedirect({ screen: 'PrayerDetail', payload: prayer }));
      }
    }

    console.log({ notification });
    // "notification": Object {
    //   "actionId": null,
    //   "data": Object {
    //     "id": "de43ec2a-05be-4d63-99dc-7cb63394d2c7",
    //   },
    //   "origin": "received",
    //   "remote": true,
    //   "userText": null,
    // },
  }

  if (isFirstOAuth) {
    return (
      <SelectGenderScreen
        setIsFirstOAuth={setIsFirstOAuth}
        setUserDataFetched={setUserDataFetched}
      />
    );
  }

  if (!userDataFetched) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};
