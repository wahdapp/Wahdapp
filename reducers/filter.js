import { SET_FILTER, INITIALIZE_FILTER } from '../constants/action_types';
import { fardhs } from 'constants/prayers';

const INITIAL_STATE = {
  selectedPrayers: fardhs,
  distance: 3,
  minimumParticipants: 0,
  sameGender: false
};

function filterReducer(state = {}, action) {
  switch (action.type) {
    case SET_FILTER:
      return action.payload;
    case INITIALIZE_FILTER:
      return { ...INITIAL_STATE, minimumParticipants: action.payload === 'M' ? 0 : 2 };
    default: return state;
  }
}

export default filterReducer;