export const SET_LOCATION = 'SET_LOCATION';

export function setLocation(payload: { latitude: number; longitude: number }) {
  return {
    type: SET_LOCATION,
    payload,
  };
}
