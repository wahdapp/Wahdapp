import React from 'react';
import { Platform, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PrayerDetailScreen from '../screens/Prayer/PrayerDetailScreen';
import JamaatsScreen from '../screens/JamaatsScreen';
import PrayerSelectionScreen from '../screens/Invitation/PrayerSelectionScreen';
import DescriptionScreen from '../screens/Invitation/DescriptionScreen';
import PrayersScreen from '../screens/PrayersScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="PrayerDetail"
        component={PrayerDetailScreen}
      />
    </Stack.Navigator>
  )
}

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

const Tab = createMaterialBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ showLabel: false }}
      activeColor="#fff"
      barStyle={{ backgroundColor: '#589e61' }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-home` : 'md-home'} />
          )
        }}
      />
      <Tab.Screen
        name="Jamaats"
        component={JamaatsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-pin` : 'md-pin'} />
          )
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={PrayersStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-notifications' : 'md-notifications'} />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default Tabs;
