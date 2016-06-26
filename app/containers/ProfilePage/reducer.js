/*
 * AuthReducer
*/

import {
  UPDATE_USER_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  updatingUser: false,
  updateUserError: null,
  changingPassword: false,
  changePasswordError: null,
});

/**
 * Reducer for authentication and authorization
 * @param  {Object} state   - Current state of the application for default is the initial state
 * @param  {Object} action  - Current action dispatched
 * @return {Object}         - New state
 */
function intlReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return state
        .set('updatingUser', true);
    case UPDATE_USER_SUCCESS:
      return state
        .set('updatingUser', false)
        .set('updateUserError', fromJS(action.error));
    case UPDATE_USER_ERROR:
      return state
        .set('updatingUser', false)
        .set('updateUserError', fromJS(action.error));
    case CHANGE_PASSWORD:
      return state
        .set('changingPassword', true);
    case CHANGE_PASSWORD_SUCCESS:
      return state
        .set('changingPassword', false)
        .set('changePasswordError', null);
    case CHANGE_PASSWORD_ERROR:
      return state
        .set('changingPassword', false)
        .set('changePasswordError', fromJS(action.error));
    default:
      return state;
  }
}

export default intlReducer;
