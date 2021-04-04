import { API_DOMAIN } from '@/constants/api';
import { auth } from '@/firebase';
import { PRAYERS } from '../types';
import axios from 'axios';

type UserPayload = {
  uid: string;
  full_name: string;
  email: string;
  gender: string;
  locale: string;
};

export async function createUser(payload: UserPayload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(`${API_DOMAIN}/user`, payload, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data;
  } catch (e) {
    throw e;
  }
}

type UserPrivateInfo = {
  id: string;
  full_name: string;
  email: string;
  gender: string;
  location?: {
    lat: number;
    lng: number;
  };
  locale: string;
  device_token?: string;
};

export async function getUserInfo(user_id: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: UserPrivateInfo }>(
      `${API_DOMAIN}/user?user_id=${user_id}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return data.data;
  } catch (e) {
    throw e;
  }
}

export async function getFilterPreference() {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/user/filter`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data.data;
  } catch (e) {
    throw e;
  }
}

type FilterPayload = {
  selected_prayers?: string[];
  minimum_participants?: number;
  same_gender?: boolean;
};

export async function updateFilterPreference(payload: FilterPayload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.patch(
      `${API_DOMAIN}/user/filter`,
      {
        minimum_participants: payload.minimum_participants,
        same_gender: payload.same_gender,
        selected_prayers: payload.selected_prayers.map((p) => PRAYERS[p]).join(''),
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return data;
  } catch (e) {
    throw e;
  }
}

export async function updateUserName(name: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.patch(
      `${API_DOMAIN}/user?full_name=${name}`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return data;
  } catch (e) {
    throw e;
  }
}

export async function deleteUser() {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.delete(`${API_DOMAIN}/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data;
  } catch (e) {
    throw e;
  }
}

export async function updateLocale(locale: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.patch(
      `${API_DOMAIN}/user/locale?locale=${locale}`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return data;
  } catch (e) {
    throw e;
  }
}

export async function updateUserLocation(location: { lat: number; lng: number }) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(
      `${API_DOMAIN}/user/location`,
      {
        lat: location.lat,
        lng: location.lng,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return data;
  } catch (e) {
    throw e;
  }
}
