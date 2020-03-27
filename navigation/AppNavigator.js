import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator } from '@react-navigation/compat';

import MainTabNavigator from './MainTabNavigator';

export default () => (
  <NavigationContainer>
    <MainTabNavigator />
  </NavigationContainer>
)