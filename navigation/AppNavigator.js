import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getLatLong } from '../helpers/geo';
import { setLocation } from '../actions';

import MainTabNavigator from './MainTabNavigator';

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getLocation();
  }, []);

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