import {
  SET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  SET_IS_NEW_NOTIFICATION,
  SET_NOTIFICATION_REDIRECT
} from '../constants/action_types';

const INITIAL_STATE = {
  notifications: [], // notification data
  isNew: false, // red dot indicator
  redirect: '' // which screen it should redirect to
};

function notificationsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return { notifications: action.payload, ...state };
    case ADD_NOTIFICATION:
      return { notifications: [action.payload, ...state.notifications], isNew: true, ...state };
    case REMOVE_NOTIFICATION:
      return { notifications: state.notifications.filter(n => n.id !== action.payload), ...state };
    case SET_IS_NEW_NOTIFICATION:
      return { ...state, isNew: action.payload };
    case SET_NOTIFICATION_REDIRECT:
      return { ...state, redirect: action.payload };
    default: return state;
  }
}

export default notificationsReducer;