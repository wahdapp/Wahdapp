import { SET_USER, SET_FULL_NAME } from '../constants/action_types';

const INITIAL_STATE = {};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case SET_FULL_NAME:
      return { ...state, fullName: action.payload };
    default: return state;
  }
}

export default userReducer;