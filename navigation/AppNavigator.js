import React, { useState, useEffect } from 'react';
import { AsyncStorage, Vibration } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getLatLong } from '../helpers/geo';
import {
  setLocation,
  setUser,
  setFilter,
  addNotification,
  setNotificationRedirect
} from '../actions';
import { Loader } from 'components';
import SelectGenderScreen from 'screens/Auth/SelectGenderScreen';
import MainTabNavigator from './MainTabNavigator';
import { Notifications } from 'expo';
import { getUserInfo } from 'services/user';

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
    }
  }, []);

  async function init() {
    // get user location
    const location = await getLatLong();
    dispatch(setLocation(location));

    await initFilter();

    const userInfo = await getUserInfo(user.uid);

    try {
      setIsFirstOAuth(false);
      setUserDataFetched(true);
      dispatch(setUser(userInfo));
    }
    catch (e) {
      // The user just signed in with OAuth
      // Let the user choose his/her gender then create a new document into the database 
      setIsFirstOAuth(true);
    }
  }

  async function initFilter() {
    const prayersFilter = await AsyncStorage.getItem('prayersFilter');
    if (prayersFilter) {
      dispatch(setFilter(JSON.parse(prayersFilter)));
    }
  }

  function handleNotification(notification) {
    Vibration.vibrate();
    dispatch(addNotification(notification.data));

    // App is open and foregrounded
    if (notification.origin === 'received') {
      Notifications.setBadgeNumberAsync(0);
    }
    else if (notification.origin === 'selected') {
      // redirect to notification screen
      dispatch(setNotificationRedirect('Notification'));
    }

    console.log({ notification })
  }

  if (isFirstOAuth) {
    return <SelectGenderScreen setIsFirstOAuth={setIsFirstOAuth} setUserDataFetched={setUserDataFetched} />
  }

  if (!userDataFetched) {
    return <Loader />
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  )
}