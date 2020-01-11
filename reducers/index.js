import { combineReducers } from 'redux';
import invitationReducer from './invitation';

const rootReducer = combineReducers({
  invitationState: invitationReducer,
});

export default rootReducer;