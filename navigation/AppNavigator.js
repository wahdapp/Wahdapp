import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getLatLong } from '../helpers/geo';
import { setLocation, setUser } from '../actions';
import { db } from '../firebase';

import MainTabNavigator from './MainTabNavigator';

export default ({ user }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    getLocation();
    getUserInfo();
  }, []);

  function getUserInfo() {
    db.ref(`users/${user.uid}`).on('value', snapshot => {
      dispatch(setUser(snapshot.val()));
    });
  }

  async function getLocation() {
    const location = await getLatLong();
    dispatch(setLocation(location));
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  )
}