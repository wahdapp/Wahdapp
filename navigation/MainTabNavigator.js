import React from 'react';
import { Platform, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import TabBarIcon from 'components/TabBarIcon';
import HomeScreen from 'screens/HomeScreen';
import PrayerDetailScreen from 'screens/Prayer/PrayerDetailScreen';
import MarkerPrayersScreen from 'screens/Prayer/MarkerPrayersScreen';
import FilterScreen from 'screens/Prayer/FilterScreen';
import MapScreen from 'screens/MapScreen';
import CreateInvitationScreen from 'screens/Invitation/CreateInvitationScreen';
import PrayersScreen from 'screens/PrayersScreen';
import ProfileScreen from 'screens/ProfileScreen';
import LanguageScreen from 'screens/Profile/LanguageScreen';
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();
const headerOptions = {
  headerStyle: { backgroundColor: '#fff', shadowColor: 'transparent', elevation: 0 },
  headerTitleStyle: { fontFamily: 'Sen', fontWeight: '200' },
}

function HomeStack() {
  const { t } = useTranslation(['TABS', 'HOME', 'FILTER', 'PRAYER_DETAILS', 'COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ ...headerOptions, title: t('HOME:HEADER') }} />
      <Stack.Screen
        name="PrayerDetail"
        component={PrayerDetailScreen}
        options={({ route }) => ({
          ...headerOptions,
          title: t('PRAYER_DETAILS:HEADER', { prayer: PRAYERS[route.params.prayer] }),
          headerTitleStyle: { fontFamily: 'Sen', textTransform: 'capitalize' }
        })} />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ ...headerOptions, title: t('FILTER:HEADER'), headerBackTitle: t('BACK') }}
      />
    </Stack.Navigator>
  )
}

function MapStack() {
  const { t } = useTranslation(['INVITATION']);
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInvitation" component={CreateInvitationScreen} options={{ ...headerOptions, title: t('HEADER') }} />
      <Stack.Screen name="MarkerPrayers" component={MarkerPrayersScreen} options={{ ...headerOptions, title: t('HISTORY_PRAYERS') }} />
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

function ProfileStack() {
  const { t } = useTranslation(['PROFILE']);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ ...headerOptions, title: t('HEADER') }} />
      <Stack.Screen name="Language" component={LanguageScreen} options={{ ...headerOptions, title: t('LANGUAGE_HEADER') }} />
    </Stack.Navigator>
  )
}

const Tab = createMaterialBottomTabNavigator();

function Tabs() {
  const { t } = useTranslation(['TABS', 'HOME', 'PROFILE', 'INVITATION', 'FILTER']);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ showLabel: false }}
      activeColor="#fff"
      barStyle={{ backgroundColor: '#12967A' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: t('HOME'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-home` : 'md-home'} />
          )
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: t('MAP'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-pin` : 'md-pin'} />
          )
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={PrayersStack}
        options={{
          tabBarLabel: t('NOTIFICATIONS'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-notifications' : 'md-notifications'} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: t('PROFILE'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default Tabs;
