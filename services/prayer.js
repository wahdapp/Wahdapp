import { API_DOMAIN } from 'constants/api';
import { auth } from 'firebaseDB';
import axios from 'axios';
import moment from 'moment';

export async function queryFeed({ lng, lat, timestamp = moment().format(), sortBy = 'distance', pageSize = 10, pageNumber = 1 }) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/feed?lng=${lng}&lat=${lat}&timestamp=${encodeURIComponent(timestamp)}&sortBy=${sortBy}&pageSize=${pageSize}&pageNumber=${pageNumber}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function queryMap({ lng, lat }) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/map?lng=${lng}&lat=${lat}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function createPrayer(payload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(`${API_DOMAIN}/prayer`, payload, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    console.log({ data })

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function deletePrayer(id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.delete(`${API_DOMAIN}/prayer?id=${id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function joinPrayer(id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(`${API_DOMAIN}/prayer/join?id=${id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function getInvitedAmount(id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/invitations/amount?user_id=${id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function getInvitedList(id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/invitations?user_id=${id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function getParticipatedAmount(id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/participated/amount?user_id=${id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function getParticipatedList(id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/prayer/participated?user_id=${id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    return data.data;
  }
  catch (e) {
    throw e;
  }
}