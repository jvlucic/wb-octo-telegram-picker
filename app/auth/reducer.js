/*
 * AuthReducer
*/

import {
  LOGGING_IN_SUCCESS,
  LOGGING_IN,
  LOGGING_IN_ERROR,
  USER_INFO,
  LOGOUT,
  SET_TOKEN,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  user: null,
  logged: false,
  loggingIn: false,
  error: null,
  roles: [],
  expireIn: 0,
  accessToken: null,
  refreshToken: null,
});

/**
 * Reducer for authentication and authorization
 * @param  {Object} state   - Current state of the application for default is the initial state
 * @param  {Object} action  - Current action dispatched
 * @return {Object}         - New state
 */
function intlReducer(state = initialState, action) {
  switch (action.type) {
    case LOGGING_IN:
      return state
        .set('loggingIn', true);
    case SET_TOKEN:
      return state
        .set('accessToken', action.token);
    case LOGGING_IN_SUCCESS:
      return state
        .set('loggingIn', false)
        .set('logged', true)
        .set('error', null)
        .set('roles', fromJS(action.roles))
        .set('expireIn', action.expire_in)
        .set('accessToken', action.access_token)
        .set('refreshToken', action.refresh_token);
    case LOGGING_IN_ERROR:
      return state
        .set('loggingIn', false)
        .set('error', fromJS(action.error));
    case LOGOUT:
      return state
      .set('loggingIn', false)
      .set('logged', false)
      .set('error', null)
      .set('roles', fromJS([]))
      .set('expireIn', 0)
      .set('accessToken', null)
      .set('refreshToken', null)
      .set('user', null);
    case USER_INFO:
      return state
        .set('user', fromJS(action.user));
    default:
      return state;
  }
}

export default intlReducer;
