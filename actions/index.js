import * as actions from '../constants/action_types';

export function setLocation(payload) {
  return {
    type: actions.SET_LOCATION,
    payload
  }
};

export function setUser(payload) {
  return {
    type: actions.SET_USER,
    payload
  }
};

export function setFullName(payload) {
  return {
    type: actions.SET_FULL_NAME,
    payload
  }
};

export function setFilter(payload) {
  return {
    type: actions.SET_FILTER,
    payload
  }
};

export function initializeFilter(gender) {
  return {
    type: actions.INITIALIZE_FILTER,
    payload: gender
  }
};

export function setNotifications(payload) {
  return {
    type: actions.SET_NOTIFICATIONS,
    payload
  }
};

export function addNotification(payload) {
  return {
    type: actions.ADD_NOTIFICATION,
    payload
  }
}

export function removeNotification(payload) {
  return {
    type: actions.REMOVE_NOTIFICATION,
    payload
  }
};

export function setIsNewNotification(payload) {
  return {
    type: actions.SET_IS_NEW_NOTIFICATION,
    payload
  }
}

export function setNotificationRedirect(payload) {
  return {
    type: actions.SET_NOTIFICATION_REDIRECT,
    payload
  }
};