import { SET_USER, SET_FULL_NAME, ADD_INVITED_AMOUNT } from '../constants/action_types';

const INITIAL_STATE = {
  full_name: '',
  email: '',
  gender: 'M',
  invitedAmount: 0,
  participatedAmount: 0
};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case SET_FULL_NAME:
      return { ...state, full_name: action.payload };
    case ADD_INVITED_AMOUNT:
      return { ...state, invitedAmount: state.invitedAmount + 1 };
    default: return state;
  }
}

export default userReducer;