import { combineReducers } from 'redux';
import invitationReducer from './invitation';
import locationReducer from './location';
import userReducer from './user';

const rootReducer = combineReducers({
  invitationState: invitationReducer,
  locationState: locationReducer,
  userState: userReducer
});

export default rootReducer;