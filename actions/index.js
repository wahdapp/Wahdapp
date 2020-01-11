import * as actions from '../constants/action_types';

export function setPrayer(payload) {
  return {
    type: actions.SET_PRAYER,
    payload
  }
};

export function setTime(payload) {
  return {
    type: actions.SET_TIME,
    payload
  }
};

export function setDescription(payload) {
  return {
    type: actions.SET_DESCRIPTION,
    payload
  }
};