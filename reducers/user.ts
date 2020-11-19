import {
  SET_USER,
  SET_FULL_NAME,
  ADD_INVITED_AMOUNT,
  SET_DEVICE_TOKEN,
  SET_NOTIFY_REGION,
} from '../constants/action_types';

const INITIAL_STATE = {
  full_name: '',
  email: '',
  gender: 'M',
  invitedAmount: 0,
  participatedAmount: 0,
  device_token: null,
  location: null,
};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case SET_FULL_NAME:
      return { ...state, full_name: action.payload };
    case ADD_INVITED_AMOUNT:
      return { ...state, invitedAmount: state.invitedAmount + 1 };
    case SET_DEVICE_TOKEN:
      return { ...state, device_token: action.payload };
    case SET_NOTIFY_REGION:
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

export default userReducer;
