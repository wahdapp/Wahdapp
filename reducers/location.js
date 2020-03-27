import { SET_LOCATION } from '../constants/action_types';

const INITIAL_STATE = {
  lat: 0,
  lon: 0
};

function locationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LOCATION:
      return action.payload;
    default: return state;
  }
}

export default locationReducer;