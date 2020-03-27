import { combineReducers } from 'redux';
import invitationReducer from './invitation';
import locationReducer from './location';

const rootReducer = combineReducers({
  invitationState: invitationReducer,
  locationState: locationReducer
});

export default rootReducer;