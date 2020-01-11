import * as actions from '../constants/action_types';

export function setPrayer(payload) {
  return {
    type: actions.SET_PRAYER,
    payload
  }
};