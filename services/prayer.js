import { API_DOMAIN } from 'constants/api';
import { auth } from 'firebaseDB';
import axios from 'axios';

export async function queryPrayer(payload) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(`${API_DOMAIN}/prayer/query`, payload, {
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