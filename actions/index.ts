import * as actions from '../constants/action_types';

export function setLocation(payload) {
  return {
    type: actions.SET_LOCATION,
    payload,
  };
}

export function setUser(payload) {
  return {
    type: actions.SET_USER,
    payload,
  };
}

export function addInvitedAmount() {
  return { type: actions.ADD_INVITED_AMOUNT };
}

export function setFullName(payload) {
  return {
    type: actions.SET_FULL_NAME,
    payload,
  };
}

export function setFilter(payload) {
  return {
    type: actions.SET_FILTER,
    payload,
  };
}

export function initializeFilter(gender) {
  return {
    type: actions.INITIALIZE_FILTER,
    payload: gender,
  };
}

export function setDeviceToken(payload: string) {
  return {
    type: actions.SET_DEVICE_TOKEN,
    payload,
  };
}

export function setNotifyRegion(payload: { lat: number; lng: number }) {
  return {
    type: actions.SET_NOTIFY_REGION,
    payload,
  };
}

export function setSortBy(payload) {
  return {
    type: actions.SET_SORT_BY,
    payload,
  };
}

export function setNotificationRedirect(payload: { screen: string; payload: any }) {
  return {
    type: actions.SET_NOTIFICATION_REDIRECT,
    payload,
  };
}
