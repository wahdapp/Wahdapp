import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import JamaatsScreen from '../screens/JamaatsScreen';
import PrayerSelectionScreen from '../screens/Invitation/PrayerSelectionScreen';
import DescriptionScreen from '../screens/Invitation/DescriptionScreen';
import PrayersScreen from '../screens/PrayersScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

function JamaatsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Jamaats" component={JamaatsScreen} />
      <Stack.Screen name="PrayerSelection" component={PrayerSelectionScreen} />
      <Stack.Screen name="Description" component={DescriptionScreen} />
    </Stack.Navigator>
  )
}

function PrayersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Prayers" component={PrayersScreen} />
    </Stack.Navigator>
  )
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator initialRouteName="Jamaats">
      <Tab.Screen
        name="Jamaats"
        component={JamaatsStack}
        options={{
          tabBarLabel: 'Jamaats',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-pin` : 'md-pin'} />
          ),
        }}
      />
      <Tab.Screen
        name="Prayers"
        component={PrayersStack}
        options={{
          tabBarLabel: 'Prayers',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-moon' : 'md-moon'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default Tabs;
