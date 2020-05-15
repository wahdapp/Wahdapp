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
import QiblaScreen from 'screens/QiblaScreen';
import ContactScreen from 'screens/ContactScreen';
import ProfileScreen from 'screens/ProfileScreen';
import InvitedScreen from 'screens/Profile/InvitedScreen';
import ParticipatedScreen from 'screens/Profile/ParticipatedScreen';
import LanguageScreen from 'screens/Profile/LanguageScreen';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

const Stack = createStackNavigator();
const headerOptions = {
  headerStyle: { backgroundColor: '#fff', shadowColor: 'transparent', elevation: 0 },
  headerTitleStyle: { fontFamily: 'Sen', fontWeight: '200', fontSize: 20, color: '#d9d9d9' },
}

function HomeStack() {
  const { t } = useTranslation(['HOME', 'FILTER']);
  
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ ...headerOptions, title: t('HOME:HEADER') }} />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ ...headerOptions, title: t('FILTER:HEADER'), headerBackTitle: ' ' }}
      />
    </Stack.Navigator>
  )
}

function MapStack() {
  const { t } = useTranslation(['INVITATION', 'PROFILE']);
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInvitation" component={CreateInvitationScreen} options={{ ...headerOptions, title: t('HEADER'), headerBackTitle: ' ' }} />
      <Stack.Screen name="MarkerPrayers" component={MarkerPrayersScreen} options={{ ...headerOptions, title: t('HISTORY_PRAYERS'), headerBackTitle: ' ' }} />
    </Stack.Navigator>
  )
}

function QiblaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Qibla" component={QiblaScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  const { t } = useTranslation(['PROFILE']);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ ...headerOptions, title: t('HEADER') }} />
      <Stack.Screen name="Invited" component={InvitedScreen} options={{ ...headerOptions, title: t('PROFILE:PRAYERS_INVITED') }} />
      <Stack.Screen name="Participated" component={ParticipatedScreen} options={{ ...headerOptions, title: t('PROFILE:PRAYERS_PARTICIPATED') }} />
      <Stack.Screen name="Language" component={LanguageScreen} options={{ ...headerOptions, title: t('LANGUAGE_HEADER') }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ ...headerOptions, title: 'Contact' }} />
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
      activeColor={colors.primary}
      barStyle={{ backgroundColor: '#fff' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: t('HOME'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon style={{ color: focused ? colors.primary : colors.secondary }} focused={focused} name={Platform.OS === 'ios' ? `ios-home` : 'md-home'} />
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
        component={QiblaStack}
        options={{
          tabBarLabel: t('QIBLA'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-compass' : 'md-compass'} />
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

function MainStack() {
  const { t } = useTranslation(['PRAYER_DETAILS', 'COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false, gestureDirection: 'horizontal' }} />
      <Stack.Screen
        name="PrayerDetail"
        component={PrayerDetailScreen}
        options={({ route }) => ({
          ...headerOptions,
          title: t('PRAYER_DETAILS:HEADER', { prayer: PRAYERS[route.params.prayer] }),
          headerTitleStyle: [headerOptions.headerTitleStyle, { textTransform: 'capitalize' }],
          headerBackTitle: ' ',
          gestureDirection: 'horizontal'
        })} />
    </Stack.Navigator>
  )
}

export default MainStack;
