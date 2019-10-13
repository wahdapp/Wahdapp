import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import JamaatsScreen from '../screens/JamaatsScreen';
import PrayerSelectionScreen from '../screens/Jamaats/PrayerSelectionScreen';
import PrayersScreen from '../screens/PrayersScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const JamaatsStack = createStackNavigator(
  {
    Jamaats: JamaatsScreen,
    PrayerSelection: PrayerSelectionScreen
  },
  config
);

JamaatsStack.navigationOptions = {
  tabBarLabel: 'Jamaats',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-pin` : 'md-pin'} />
  ),
};

JamaatsStack.path = '';

const PrayersStack = createStackNavigator(
  {
    Prayers: PrayersScreen,
  },
  config
);

PrayersStack.navigationOptions = {
  tabBarLabel: 'Prayers',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-moon' : 'md-moon'} />
  ),
};

PrayersStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  JamaatsStack,
  PrayersStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
