import * as actions from '../constants/action_types';

export function setLocation(payload) {
  return {
    type: actions.SET_LOCATION,
    payload
  }
};

export function setUser(payload) {
  return {
    type: actions.SET_USER,
    payload
  }
};

export function setFullName(payload) {
  return {
    type: actions.SET_FULL_NAME,
    payload
  }
};

export function setFilter(payload) {
  return {
    type: actions.SET_FILTER,
    payload
  }
};

export function initializeFilter(gender) {
  return { type: actions.INITIALIZE_FILTER, payload: gender }
};