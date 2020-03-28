import { combineReducers } from 'redux';
import locationReducer from './location';
import userReducer from './user';
import filterReducer from './filter';

const rootReducer = combineReducers({
  locationState: locationReducer,
  userState: userReducer,
  filterState: filterReducer
});

export default rootReducer;