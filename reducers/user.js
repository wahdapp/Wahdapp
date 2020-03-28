import { SET_USER } from '../constants/action_types';

const INITIAL_STATE = {};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    default: return state;
  }
}

export default userReducer;