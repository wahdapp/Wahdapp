export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  PrayerTime: undefined;
  Profile: undefined;
  Filter: undefined;
  CreateInvitation: undefined;
  MarkerPrayers: undefined;
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
  inviter: string;
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
