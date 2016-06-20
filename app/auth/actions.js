
import {
  LOGGING_IN,
  LOGGING_IN_SUCCESS,
  LOGGING_IN_ERROR,
} from './constants';
import request from 'utils/request';

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
 * @param  {string} locale              - Locale that want change
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
 * Authenticate an user given username and password
 * @param  {string} username - Username to be logged
 * @param  {string} password - Password of the user
 * @return {Promise}       - Promise that resolve when all the call is made
 */
export function authenticate(username, password) {
  return (dispatch) => {
    dispatch(logginIn());
    const url = 'http://api-test.unidesq.com/auth';
    return request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(
      ({ data, err }) => {
        if (err) {
          return dispatch(logginInError('The username or the password are invalid.'));
        }
        return dispatch(logginInSuccess(data));
      },
      () => dispatch(logginInError('The username or the password are invalid.')),
     );
  };
}
