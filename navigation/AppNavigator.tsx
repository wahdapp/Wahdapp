import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { setLocation } from '@/actions/location';
import { setUser } from '@/actions/user';
import { setFilter } from '@/actions/filter';
import { setNotificationRedirect } from '@/actions/notifications';
import { Loader } from '@/components';
import MainTabNavigator from './MainTabNavigator';
import * as Notifications from 'expo-notifications';
import { getUserInfo, updateLocale } from '@/services/user';
import { getPrayerByID } from '@/services/prayer';
import i18n from 'i18next';
import { formatLanguage } from '@/helpers/dateFormat';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AppNavigator({ userAuth, userInfo, position }) {
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [isFirstMounted, setIsFirstMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    init();

    const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      // unsubscribe listeners
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    if (position) {
      dispatch(setLocation(position));
    }
  }, [position]);

  useEffect(() => {
    if (userInfo) {
      setUserDataFetched(true);
      dispatch(setUser(userInfo));
    }
    setIsFirstMounted(true);
  }, [userInfo]);

  useEffect(() => {
    if (userAuth && isFirstMounted) {
      (async () => {
        try {
          setUserDataFetched(false);
          const info = await getUserInfo(userAuth.uid);

          if (info.locale !== i18n.language) {
            updateLocale(i18n.language);
          }
          setUserDataFetched(true);
          dispatch(setUser(info));
        } catch (e) {
          console.log(e);
          setUserDataFetched(true);
        }
      })();
    } else {
      setUserDataFetched(true);
    }
  }, [userAuth, userInfo]);

  async function init() {
    formatLanguage(i18n.language);
    await initFilter();
  }

  async function initFilter() {
    const prayersFilter = await AsyncStorage.getItem('prayersFilter');
    if (prayersFilter) {
      dispatch(setFilter(JSON.parse(prayersFilter)));
    }
  }

  async function handleNotification(notification: Notifications.Notification) {
    // handle any new incoming notification
  }

  async function handleNotificationResponse(response: Notifications.NotificationResponse) {
    if (response.notification.request.content.data.id) {
      const prayer = await getPrayerByID(response.notification.request.content.data.id as string);
      dispatch(setNotificationRedirect({ screen: 'PrayerDetail', payload: prayer }));
    }
  }

  if (!userDataFetched) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}
