import React, { useState, useEffect } from 'react';
import { AsyncStorage, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getLatLong } from '../helpers/geo';
import { setLocation, setUser, setFilter, initializeFilter } from '../actions';
import { db } from '../firebase';
import SelectGenderScreen from 'screens/Auth/SelectGenderScreen';

import MainTabNavigator from './MainTabNavigator';

export default ({ user }) => {
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [isFirstOAuth, setIsFirstOAuth] = useState(false);
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
      setIsFirstOAuth(false);
      setUserDataFetched(true);
      dispatch(setUser(doc.data()));
      initFilter(doc.data());
    }
    else {
      // The user just signed in with OAuth
      // Let the user choose his/her gender then create a new document into the database 
      setIsFirstOAuth(true);
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

  if (isFirstOAuth) {
    return <SelectGenderScreen setIsFirstOAuth={setIsFirstOAuth} setUserDataFetched={setUserDataFetched} />
  }

  if (!userDataFetched) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  )
}

function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" />
    </View>
  )
}