import { MapEvent } from 'react-native-maps';

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  PrayerTime: undefined;
  Profile: undefined;
  Filter: undefined;
  CreateInvitation: { latitude: number; longitude: number; removeMarker: () => void };
  MarkerPrayers: {
    nearbyPrayers: MapQueryData[];
    handleConfirm: (
      coords: MapEvent<{
        action: 'marker-press';
        id: string;
      }>
    ) => void;
  };
  Notification: undefined;
  Invited: undefined;
  Participated: undefined;
  Language: undefined;
  Contact: undefined;

  Tabs: undefined;
  PrayerDetail: Prayer;
  ReportPrayer: undefined;
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

export interface MapQueryData {
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
}

export interface FilteredMapQuery extends MapQueryData {
  geohash: string;
}
