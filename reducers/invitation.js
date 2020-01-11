import { SET_PRAYER, SET_PEOPLE, SET_TIME, SET_DESCRIPTION } from '../constants/action_types';

const INITIAL_STATE = {
  prayer: '',
  people: null,
  time: null,
  description: ''
};

function invitationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_PRAYER:
      return { ...state, prayer: action.payload };
    case SET_PEOPLE:
      return { ...state, people: action.payload };
    case SET_TIME:
      return { ...state, time: action.payload };
    case SET_DESCRIPTION:
      return { ...state, description: action.payload };
    default: return state;
  }
}

export default invitationReducer;