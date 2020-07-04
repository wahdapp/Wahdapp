import { SET_FILTER, INITIALIZE_FILTER, SET_SORT_BY } from '../constants/action_types';

const INITIAL_STATE = {
  sortBy: 'distance'
};

function filterReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_FILTER:
      return action.payload;
    case INITIALIZE_FILTER:
      return INITIAL_STATE;
    case SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    default: return state;
  }
}

export default filterReducer;