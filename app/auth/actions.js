import {
  LOGOUT,
  SET_TOKEN,
  LOGGING_IN,
  LOGGING_IN_SUCCESS,
  LOGGING_IN_ERROR,
  USER_INFO,
} from './constants';
import request from 'utils/request';
import { generateURL, secureRequest } from 'utils/unidesqApi';
import { push } from 'react-router-redux';

/**
 * LOGGING_IN action creation
 * @return {Object}        - Action
 */
export function logginIn() {
  return {
    type: LOGGING_IN,
  };
}

/**
 * Action creator for LOGGING_IN_SUCCESS
 * @param  {Object} authData            - Auth data
 * @return {Object}                     - Action of LOGGING_IN_SUCCESS
 * @property {string} type              - LOGGING_IN_SUCCESS
 * @property {string} username          - Username logged
 * @property {Array.<string>} roles     - Roles of the user
 * @property {string} access_token      - Token that authorize the user
 * @property {string} expires_in        - Expiration time of the token
 * @property {string} refreshToken      - Token to refresh the session
 */
export function logginInSuccess({ username, roles, access_token, expires_in, refresh_token } = {}) {
  return {
    type: LOGGING_IN_SUCCESS,
    username,
    roles,
    access_token,
    expires_in,
    refresh_token,
  };
}

/**
 * Action creator for LOGGING_IN_ERROR
 * @param  {*} error          - Error that happen when was changing the locale
 * @return {Object}           - Action of LOGGING_IN_ERROR
 * @property {string} type    - LOGGING_IN_ERROR
 * @property {*} error        - Error to pass the reducer
 */
export function logginInError(error) {
  return {
    type: LOGGING_IN_ERROR,
    error,
  };
}

/**
 * Handle logout action, aso redirect to login
 */
export function logout() {
  return dispatch => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem('logginInSuccess');
    dispatch(push('/login'));
  };
}

/**
 * Action creator for USER_INFO
 * @param  {Object} user  - User info to be stored
 * @return {object]}      - Action
 */
export function userInfo(user) {
  return {
    type: USER_INFO,
    user,
  };
}

/**
 * Action creator for SET_TOKEN
 * @param  {string} token   - Token to be added in state
 * @return {object]}        - Action
 */
export function setToken(token) {
  return {
    type: SET_TOKEN,
    token,
  };
}

/**
 * Method to retrieve the user information using the token from argument or state
 * @param {?string} tokenArg          - Optional token to be used instead of state one
 * @return {Promise.<object, string>} - Promise to resolve to user info or reject with string error
 */
export function getUserInfo() {
  return (dispatch, getState) => {
    const urlUser = generateURL('user');
    return secureRequest({ dispatch, getState }, urlUser)
    .then(({ data: user, err: userErr }) => {
      if (userErr) {
        return Promise.reject('I can retrieve the user info');
      }
      dispatch(userInfo(user));
      return Promise.resolve(user);
    });
  };
}

function authError(dispatch) {
  const msg = 'The username or the password are invalid.';
  dispatch(logginInError(msg));
  return Promise.reject(msg);
}

/**
 * Authenticate an user given username and password
 * @param  {string} username - Username to be logged
 * @param  {string} password - Password of the user
 * @return {Promise}       - Promise that resolve when all the call is made
 */
export function authenticate(username, password) {
  return (dispatch) => {
    dispatch(logginIn());
    const url = generateURL('auth');
    return request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(
      ({ data: auth, err }) => {
        if (err) {
          return Promise.reject('There is an error in login');
        }
        dispatch(setToken(auth.access_token));
        return dispatch(getUserInfo(auth.access_token))
          .then(
            () => {
              // Store the success response in localstorage
              localStorage.setItem('logginInSuccess', JSON.stringify(auth));
              return dispatch(logginInSuccess(auth));
            },
          );
      }
     )
    .catch(() => authError(dispatch));
  };
}
