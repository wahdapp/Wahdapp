import { API_DOMAIN } from '@/constants/api';
import { auth } from '@/firebase';
import { Prayer } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';

export async function getPrayerByID(id: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: Prayer }>(`${API_DOMAIN}/prayer?id=${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data.data;
  } catch (e) {
    throw e;
  }
}

type FeedQueryType = {
  lng: number;
  lat: number;
  timestamp?: string;
  sortType: 'distance' | 'participants' | 'time';
  pageNumber: number;
};

export async function queryFeed({
  lng,
  lat,
  timestamp = dayjs().format(),
  sortType = 'distance',
  pageNumber = 1,
}: FeedQueryType) {
  try {
    let sortBy;

    switch (sortType) {
      case 'distance':
        sortBy = 'distance';
        break;
      case 'participants':
        sortBy = 'count';
        break;
      case 'time':
        sortBy = 'time';
        break;
      default:
        sortBy = 'distance';
    }

    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: Prayer[] }>(
      `${API_DOMAIN}/prayer/feed?lng=${lng}&lat=${lat}&timestamp=${encodeURIComponent(
        timestamp
      )}&sortBy=${sortBy}&pageNumber=${pageNumber}`,
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

export async function queryMap({ lng, lat }) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: Prayer[] }>(
      `${API_DOMAIN}/prayer/map?lng=${lng}&lat=${lat}`,
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

export async function createPrayer(payload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(`${API_DOMAIN}/prayer`, payload, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data.data;
  } catch (e) {
    throw e;
  }
}

export async function deletePrayer(id: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.delete(`${API_DOMAIN}/prayer?id=${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data;
  } catch (e) {
    throw e;
  }
}

export async function joinPrayer(id: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/join?id=${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return data;
  } catch (e) {
    throw e;
  }
}

export async function getInvitedAmount(id: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: { amount: number } }>(
      `${API_DOMAIN}/prayer/invitations/amount?user_id=${id}`,
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

export async function getInvitedList(id: string, pageNumber: number) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: Prayer[] }>(
      `${API_DOMAIN}/prayer/invitations?user_id=${id}&pageNumber=${pageNumber}`,
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

export async function getParticipatedAmount(id: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: { amount: number } }>(
      `${API_DOMAIN}/prayer/participated/amount?user_id=${id}`,
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

export async function getParticipatedList(id: string, pageNumber: number) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get<{ data: Prayer[] }>(
      `${API_DOMAIN}/prayer/participated?user_id=${id}&pageNumber=${pageNumber}`,
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

export async function reportPrayer(prayerID: string, category: number, description: string) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(
      `${API_DOMAIN}/report`,
      {
        prayer_id: prayerID,
        category,
        description,
      },
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
