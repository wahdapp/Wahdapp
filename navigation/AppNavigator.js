import React, { useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getLatLong } from '../helpers/geo';
import { setLocation, setUser, setFilter, initializeFilter } from '../actions';
import { db } from '../firebase';

import MainTabNavigator from './MainTabNavigator';

export default ({ user }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    // get user location
    const location = await getLatLong();
    dispatch(setLocation(location));

    const doc = await db.collection('users').doc(user.uid).get();
    if (doc.exists) {
      dispatch(setUser(doc.data()));
      initFilter(doc.data());
    }
  }

  async function initFilter(userData) {
    const prayersFilter = await AsyncStorage.getItem('prayersFilter');
    if (prayersFilter) {
      dispatch(setFilter(JSON.parse(prayersFilter)));
    }
    else {
      // initialize according to user's gender
      dispatch(initializeFilter(userData.gender));
    }
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  )
}