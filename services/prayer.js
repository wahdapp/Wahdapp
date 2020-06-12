import { API_DOMAIN } from 'constants/api';
import { auth } from 'firebaseDB';
import axios from 'axios';

const config = {
  headers: {
    Authorization: `Token ${auth.stsTokenManager.accessToken}`
  }
}

export async function queryPrayer(payload) {
  try {
    const { data } = await axios.post(`${API_DOMAIN}/prayer/query`, payload, config);

    return data;
  }
  catch (e) {
    throw e;
  }
}

export async function createPrayer(payload) {
  try {
    const { data } = await axios.post(`${API_DOMAIN}/prayer`, payload, config);

    return data.data;
  }
  catch (e) {
    throw e;
  }
}

export async function joinPrayer(id) {
  try {
    const { data } = await axios.post(`${API_DOMAIN}/prayer/join?id=${id}`, config);

    return data;
  }
  catch (e) {
    throw e;
  }
}