import { SET_LOCATION } from '../constants/action_types';

function locationReducer(state = {}, action) {
  switch (action.type) {
    case SET_LOCATION:
      return action.payload;
    default: return state;
  }
}

export default locationReducer;