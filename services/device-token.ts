import { API_DOMAIN } from '@/constants/api';
import { auth } from '@/firebase';
import axios from 'axios';

export async function registerToken(deviceToken) {
  try {
    const token = await auth.currentUser.getIdToken();
    const { data } = await axios.post(
      `${API_DOMAIN}/device-token`,
      {
        token: deviceToken,
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

export async function deleteDeviceToken() {
  try {
    const token = await auth.currentUser.getIdToken();
    await axios.delete(`${API_DOMAIN}/device-token`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  } catch (e) {
    throw e;
  }
}
