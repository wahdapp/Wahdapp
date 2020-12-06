export const SET_NOTIFICATION_REDIRECT = 'SET_NOTIFICATION_REDIRECT';

export function setNotificationRedirect(payload: { screen: string; payload: any }) {
  return {
    type: SET_NOTIFICATION_REDIRECT,
    payload,
  };
}
