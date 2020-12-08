import {
  SET_USER,
  SET_FULL_NAME,
  ADD_INVITED_AMOUNT,
  SET_DEVICE_TOKEN,
  SET_NOTIFY_REGION,
  SET_INVITED_AMOUNT,
  SET_PARTICIPATED_AMOUNT,
  INIT_USER,
} from '@/actions/user';

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
      return { ...state, ...action.payload };
    case SET_FULL_NAME:
      return { ...state, full_name: action.payload };
    case ADD_INVITED_AMOUNT:
      return { ...state, invitedAmount: state.invitedAmount + 1 };
    case SET_DEVICE_TOKEN:
      return { ...state, device_token: action.payload };
    case SET_NOTIFY_REGION:
      return { ...state, location: action.payload };
    case SET_INVITED_AMOUNT:
      return { ...state, invitedAmount: action.payload };
    case SET_PARTICIPATED_AMOUNT:
      return { ...state, participatedAmount: action.payload };
    case INIT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default userReducer;
