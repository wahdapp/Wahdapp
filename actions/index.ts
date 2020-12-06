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

export function setInvitedAmount(payload: number) {
  return {
    type: actions.SET_INVITED_AMOUNT,
    payload,
  };
}

export function setParticipatedAmount(payload: number) {
  return {
    type: actions.SET_PARTICIPATED_AMOUNT,
    payload,
  };
}

export function addInvitedAmount() {
  return { type: actions.ADD_INVITED_AMOUNT };
}

export function minusInvitedAmount() {
  return { type: actions.MINUS_INVITED_AMOUNT };
}

export function addParticipatedAmount() {
  return { type: actions.ADD_PARTICIPATED_AMOUNT };
}

export function minusParticipatedAmount() {
  return { type: actions.MINUS_PARTICIPATED_AMOUNT };
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

export function cancelPrayer(payload: string) {
  return {
    type: actions.CANCEL_PRAYER,
    payload,
  };
}
