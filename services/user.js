import { API_DOMAIN } from 'constants/api';
import { auth } from 'firebaseDB';
import axios from 'axios';

const config = {
  headers: {
    Authorization: `Token ${auth.stsTokenManager.accessToken}`
  }
}

export async function createUser(payload) {
  try {
    const { data } = await axios.post(`${API_DOMAIN}/user`, payload);

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function getUserInfo(user_id) {
  try {
    const { data } = await axios.get(`${API_DOMAIN}/user?user_id=${user_id}`, config);

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function updateFilterPreference(payload) {
  try {
    const { data } = await axios.patch(`${API_DOMAIN}/user/filter`, payload, config);

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function updateUser(payload) {
  try {
    const { data } = await axios.patch(`${API_DOMAIN}/user`, payload, config);

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function deleteUser(payload) {
  try {
    const { data } = await axios.delete(`${API_DOMAIN}/user`, config);

    return data;
  }
  catch (e) {
    throw e;
  }
}