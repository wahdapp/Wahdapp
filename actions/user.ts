export const SET_USER = 'SET_USER';
export const SET_FULL_NAME = 'SET_FULL_NAME';
export const ADD_INVITED_AMOUNT = 'ADD_INVITED_AMOUNT';
export const MINUS_INVITED_AMOUNT = 'MINUS_INVITED_AMOUNT';
export const SET_DEVICE_TOKEN = 'SET_DEVICE_TOKEN';
export const SET_NOTIFY_REGION = 'SET_NOTIFY_REGION';
export const SET_INVITED_AMOUNT = 'SET_INVITED_AMOUNT';
export const SET_PARTICIPATED_AMOUNT = 'SET_PARTICIPATED_AMOUNT';
export const ADD_PARTICIPATED_AMOUNT = 'ADD_PARTICIPATED_AMOUNT';
export const MINUS_PARTICIPATED_AMOUNT = 'MINUS_PARTICIPATED_AMOUNT';

export function setUser(payload) {
  return {
    type: SET_USER,
    payload,
  };
}

export function setInvitedAmount(payload: number) {
  return {
    type: SET_INVITED_AMOUNT,
    payload,
  };
}

export function setParticipatedAmount(payload: number) {
  return {
    type: SET_PARTICIPATED_AMOUNT,
    payload,
  };
}

export function addInvitedAmount() {
  return { type: ADD_INVITED_AMOUNT };
}

export function minusInvitedAmount() {
  return { type: MINUS_INVITED_AMOUNT };
}

export function addParticipatedAmount() {
  return { type: ADD_PARTICIPATED_AMOUNT };
}

export function minusParticipatedAmount() {
  return { type: MINUS_PARTICIPATED_AMOUNT };
}

export function setFullName(payload) {
  return {
    type: SET_FULL_NAME,
    payload,
  };
}

export function setDeviceToken(payload: string) {
  return {
    type: SET_DEVICE_TOKEN,
    payload,
  };
}

export function setNotifyRegion(payload: { lat: number; lng: number }) {
  return {
    type: SET_NOTIFY_REGION,
    payload,
  };
}
