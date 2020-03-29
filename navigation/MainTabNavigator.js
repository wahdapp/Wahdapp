import React from 'react';
import { Platform, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import TabBarIcon from 'components/TabBarIcon';
import HomeScreen from 'screens/HomeScreen';
import PrayerDetailScreen from 'screens/Prayer/PrayerDetailScreen';
import FilterScreen from 'screens/Prayer/FilterScreen';
import MapScreen from 'screens/MapScreen';
import CreateInvitationScreen from 'screens/Invitation/CreateInvitationScreen';
import PrayersScreen from 'screens/PrayersScreen';
import SettingsScreen from 'screens/SettingsScreen';

const Stack = createStackNavigator();
const headerOptions = {
  headerStyle: { backgroundColor: '#f7f7f7' },
  headerTitleStyle: { fontFamily: 'Sen' }
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="PrayerDetail"
        component={PrayerDetailScreen}
        options={({ route }) => ({
          ...headerOptions,
          title: `${route.params.prayer} prayer`,
          headerTitleStyle: { fontFamily: 'Sen', textTransform: 'capitalize' }
        })} />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ ...headerOptions, title: 'Filter' }}
        />
    </Stack.Navigator>
  )
}

function MapStack() {
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInvitation" component={CreateInvitationScreen} options={{ ...headerOptions, title: 'Invite Prayer' }} />
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
      barStyle={{ backgroundColor: '#589e61' }}
    >
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
        name="Map"
        component={MapStack}
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
