import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import TabBarIcon from '@/components/TabBarIcon';

// Prayer
import PrayerDetailScreen from '@/screens/Prayer/PrayerDetailScreen';
import MarkerPrayersScreen from '@/screens/Prayer/MarkerPrayersScreen';
import FilterScreen from '@/screens/Prayer/FilterScreen';
import CreateInvitationScreen from '@/screens/Prayer/CreateInvitationScreen';
import ReportPrayerScreen from '@/screens/Prayer/ReportPrayerScreen';

// Profile
import ContactScreen from '@/screens/Profile/ContactScreen';
import InvitedScreen from '@/screens/Profile/InvitedScreen';
import ParticipatedScreen from '@/screens/Profile/ParticipatedScreen';
import LanguageScreen from '@/screens/Profile/LanguageScreen';

// Auth
import LoginScreen from '@/screens/Auth/LoginScreen';
import SignupScreen from '@/screens/Auth/SignupScreen';
import ForgotPasswordScreen from '@/screens/Auth/ForgotPasswordScreen';
import EmailSentScreen from '@/screens/Auth/EmailSentScreen';

// Tabs
import HomeScreen from '@/screens/Tabs/HomeScreen';
import MapScreen from '@/screens/Tabs/MapScreen';
// import NotificationScreen from '@/screens/Tabs/NotificationScreen';
import ProfileScreen from '@/screens/Tabs/ProfileScreen';
import PrayerTimeScreen from '@/screens/Tabs/PrayerTimeScreen';

import { useTranslation } from 'react-i18next';
import colors from '@/constants/colors';
import { Text } from '@/components';
import { MAN_AVATAR, WOMAN_AVATAR } from '@/assets/images';
import { RootStackParamList } from '@/types';
import { useUserInfo } from '@/hooks/redux';
import { useAuthStatus } from '@/hooks/auth';
import { auth } from '@/firebase';

const headerStyle = {
  backgroundColor: '#fff',
  shadowColor: 'transparent',
  elevation: 0,
};

const Stack = createStackNavigator<RootStackParamList>();
const headerOptions = {
  headerStyle: { backgroundColor: '#fff', shadowColor: 'transparent', elevation: 0 },
  headerTitleStyle: { fontFamily: 'SenBold', fontSize: 18, color: '#d9d9d9' },
};

function HomeStack() {
  const { t } = useTranslation(['HOME', 'FILTER']);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ ...headerOptions, title: t('FILTER:HEADER'), headerBackTitle: ' ' }}
      />
    </Stack.Navigator>
  );
}

function MapStack() {
  const { t } = useTranslation(['INVITATION', 'PROFILE']);
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="MarkerPrayers"
        component={MarkerPrayersScreen}
        options={{ ...headerOptions, title: t('HISTORY_PRAYERS'), headerBackTitle: ' ' }}
      />
    </Stack.Navigator>
  );
}

function PrayerTimeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PrayerTime"
        component={PrayerTimeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// function NotificationStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Notification"
//         component={NotificationScreen}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// }

function AuthStack() {
  const { t } = useTranslation(['SIGN']);
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, headerStyle }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: '',
          headerBackTitle: t('LOGIN'),
          headerStyle,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: '',
          headerBackTitle: t('LOGIN'),
          headerStyle,
        }}
      />
      <Stack.Screen
        name="EmailSent"
        component={EmailSentScreen}
        options={{ headerShown: false, headerStyle }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { t } = useTranslation(['PROFILE']);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false, title: t('PROFILE:HEADER') }}
      />
      <Stack.Screen
        name="Invited"
        component={InvitedScreen}
        options={{ ...headerOptions, title: t('PROFILE:PRAYERS_INVITED') }}
      />
      <Stack.Screen
        name="Participated"
        component={ParticipatedScreen}
        options={{ ...headerOptions, title: t('PROFILE:PRAYERS_PARTICIPATED') }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ ...headerOptions, title: t('LANGUAGE_HEADER'), headerBackTitle: ' ' }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ ...headerOptions, title: t('PROFILE:OPTIONS.CONTACT') }}
      />
    </Stack.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();

function Tabs() {
  const user = useUserInfo();
  const isAuth = useAuthStatus();

  return (
    <Tab.Navigator
      initialRouteName={isAuth ? 'Home' : 'Auth'}
      activeColor={colors.primary}
      barStyle={{ backgroundColor: '#fff', height: 60, justifyContent: 'center' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: <Text style={{ fontSize: 14 }}>•</Text>,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: <Text style={{ fontSize: 14 }}>•</Text>,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="globe" />,
        }}
      />
      <Tab.Screen
        name="PrayerTime"
        component={PrayerTimeStack}
        options={{
          tabBarLabel: <Text style={{ fontSize: 14 }}>•</Text>,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="moon" />,
        }}
      />
      {/* <Tab.Screen
        name="Notification"
        component={NotificationStack}
        options={{
          tabBarLabel: <Text style={{ fontSize: 8, marginTop: 5 }}>{t('NOTIFICATION')}</Text>,
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'relative' }}>
              {isNew && <View style={{ backgroundColor: 'red', height: 6, width: 6, zIndex: 10, position: 'absolute', borderRadius: '50%', right: 0, top: 0 }} />}
              <TabBarIcon focused={focused} name="bell" />
            </View>
          )
        }}
      /> */}
      {isAuth ? (
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: <Text style={{ fontSize: 14 }}>•</Text>,
            tabBarIcon: () => (
              <Image
                source={user.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Auth"
          component={AuthStack}
          options={{
            tabBarLabel: <Text style={{ fontSize: 14 }}>•</Text>,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="log-in" />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function MainStack() {
  const { t } = useTranslation(['PRAYER_DETAILS', 'COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false, gestureDirection: 'horizontal' }}
      />
      <Stack.Screen
        name="PrayerDetail"
        component={PrayerDetailScreen}
        options={({ route }) => ({
          ...headerOptions,
          title: t('PRAYER_DETAILS:HEADER', { prayer: PRAYERS[route.params.prayer] }),
          headerTitleStyle: [headerOptions.headerTitleStyle, { textTransform: 'capitalize' }],
          headerBackTitle: ' ',
          gestureDirection: 'horizontal',
        })}
      />
      <Stack.Screen
        name="CreateInvitation"
        component={CreateInvitationScreen}
        options={{ ...headerOptions, title: '', headerBackTitle: ' ' }}
      />
      <Stack.Screen
        name="ReportPrayer"
        component={ReportPrayerScreen}
        options={() => ({
          ...headerOptions,
          title: '',
          headerTitleStyle: [headerOptions.headerTitleStyle, { textTransform: 'capitalize' }],
          gestureDirection: 'horizontal',
        })}
      />
    </Stack.Navigator>
  );
}

export default MainStack;
