import { Dispatch, SetStateAction } from 'react';
import { MapEvent } from 'react-native-maps';

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  PrayerTime: undefined;
  Profile: undefined;
  Filter: undefined;
  CreateInvitation: { latitude: number; longitude: number; removeMarker: () => void };
  MarkerPrayers: {
    nearbyPrayers: PrayerQuery[];
    handleConfirm: (location: { latitude: number; longitude: number }) => void;
  };
  Notification: undefined;
  Invited: undefined;
  Participated: undefined;
  Language: undefined;
  Contact: undefined;

  Tabs: undefined;
  PrayerDetail: Prayer;
  ReportPrayer: { prayerID: string };
};

export type AuthStackParamList = {
  EmailSent: undefined;
  ForgotPassword: undefined;
  Login: undefined;
  Signup: undefined;
};

export interface Prayer {
  guests_male: number;
  guests_female: number;
  inviter: User;
  participants: User[];
  prayer: string;
  schedule_time: string;
  location: { lat: number; lng: number };
  id: string;
  description: string;
}

export interface User {
  full_name: string;
  gender: string;
  email: string;
}

export interface PrayerQuery {
  id: string;
  prayer: string;
  location: {
    lat: number;
    lng: number;
  };
  inviter: User;
  participants: string[];
  guests_male: number;
  guests_female: number;
  schedule_time: string;
  description: string;
}

export interface FilteredMapQuery extends PrayerQuery {
  geohash: string;
}
