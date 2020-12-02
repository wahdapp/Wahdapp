import { SET_NOTIFICATION_REDIRECT } from '../constants/action_types';

const INITIAL_STATE = {
  redirectScreen: '', // which screen it should redirect to
  redirectPayload: {},
};

function notificationsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_NOTIFICATION_REDIRECT:
      return {
        ...state,
        redirectScreen: action.payload.screen,
        redirectPayload: action.payload.payload,
      };
    default:
      return state;
  }
}

export default notificationsReducer;
