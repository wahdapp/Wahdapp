export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  PrayerTime: undefined;
  Profile: undefined;
  Filter: undefined;
  CreateInvitation: { latitude: number; longitude: number; removeMarker: () => void };
  MarkerPrayers: {
    nearbyPrayers: Prayer[];
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
  id: string;
  prayer: string;
  location: {
    lat: number;
    lng: number;
  };
  inviter: User;
  participants: User[];
  guests_male: number;
  guests_female: number;
  schedule_time: string;
  description: string;
}

export interface User {
  id: string;
  full_name: string;
  gender: string;
  email: string;
}
