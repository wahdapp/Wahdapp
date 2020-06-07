import { combineReducers } from 'redux';
import locationReducer from './location';
import userReducer from './user';
import filterReducer from './filter';
import notificationsReducer from './notifications';

const rootReducer = combineReducers({
  locationState: locationReducer,
  userState: userReducer,
  filterState: filterReducer,
  notificationState: notificationsReducer
});

export default rootReducer;