import { API_DOMAIN } from 'constants/api';
import { auth } from 'firebaseDB';
import axios from 'axios';

export async function createUser(payload) {
  try {
    console.log(`${API_DOMAIN}/user`)
    const { data } = await axios.post(`${API_DOMAIN}/user`, payload);

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function getUserInfo(user_id) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.get(`${API_DOMAIN}/user?user_id=${user_id}`, {
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

export async function updateFilterPreference(payload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.patch(`${API_DOMAIN}/user/filter`, payload, {
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

export async function updateUser(payload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.patch(`${API_DOMAIN}/user`, payload, {
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

export async function deleteUser(payload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.delete(`${API_DOMAIN}/user`, {
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