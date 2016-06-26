
import {
  UPDATE_USER_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
} from './constants';
import request from 'utils/request';
import { generateURL, secureHeader, applicationJsonHeader } from 'utils/unidesqApi';
import { userInfo } from 'auth/actions';
import { selectToken, selectUserId } from 'auth/selectors';

/**
 * UPDATE_USER action creation
 * @return {Object}        - Action
 */
export function updateUser() {
  return {
    type: UPDATE_USER,
  };
}

/**
 * Action creator for UPDATE_USER_SUCCESS
 * @return {Object}                     - Action of UPDATE_USER_SUCCESS
 */
export function updateUserSuccess() {
  return {
    type: UPDATE_USER_SUCCESS,
  };
}

/**
 * Action creator for UPDATE_USER_ERROR
 * @param  {*} error          - Error that happen i was updating the user
 * @return {Object}           - Action of UPDATE_USER_ERROR
 * @property {string} type    - UPDATE_USER_ERROR
 * @property {*} error        - Error to pass the reducer
 */
export function updateUserError(error) {
  return {
    type: UPDATE_USER_ERROR,
    error,
  };
}

/**
 * CHANGE_PASSWORD action creation
 * @return {Object}        - Action
 */
export function changePassword() {
  return {
    type: CHANGE_PASSWORD,
  };
}

/**
 * Action creator for CHANGE_PASSWORD_SUCCESS
 * @return {Object}                     - Action of CHANGE_PASSWORD_SUCCESS
 */
export function changePaswordSuccess() {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
  };
}

/**
 * Action creator for CHANGE_PASSWORD_ERROR
 * @param  {*} error          - Error that happen i was updating the user
 * @return {Object}           - Action of CHANGE_PASSWORD_ERROR
 * @property {string} type    - CHANGE_PASSWORD_ERROR
 * @property {*} error        - Error to pass the reducer
 */
export function changePaswordError(error) {
  return {
    type: CHANGE_PASSWORD_ERROR,
    error,
  };
}

/**
 * Change password api call thunk called the actions in the given orders
 * @param  {string} oldPassword   - Old password of the user
 * @param  {string} newPassword   - Password to be change
 * @return {Function}             [description]
 */
export function postChangePassword(oldPassword, newPassword) {
  return (dispatch, getState) => {
    const token = selectToken(getState());
    if (!token) {
      return Promise.reject('The user must be logged to change the password');
    }
    dispatch(changePassword());
    const urlChangePassword = generateURL('user/changePassword');
    return request(urlChangePassword, {
      method: 'POST',
      headers: {
        ...secureHeader(token),
        ...applicationJsonHeader(),
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    .then(
      ({ err: userErr }) => {
        if (userErr) {
          return Promise.reject('I can\'t change the password');
        }
        dispatch(changePaswordSuccess());
        return Promise.resolve();
      }
    )
    .catch(() => {
      const msg = 'The password can\'t be updated';
      dispatch(changePaswordError(msg));
      return Promise.reject(msg);
    });
  };
}

/**
 * Method to retrieve the user information using the token from argument or state
 * @param {?string} tokenArg          - Optional token to be used instead of state one
 * @return {Promise.<object, string>} - Promise to resolve to user info or reject with string error
 */
export function updateUserInfo({ username, firstName, lastName, email, companyName, phoneNumber } = {}) {
  return (dispatch, getState) => {
    const token = selectToken(getState());
    const userId = selectUserId(getState());
    if (!token || !userId) {
      return Promise.reject('The user must be logged to update the info');
    }
    dispatch(updateUser());
    const urlUser = generateURL('user');
    return request(urlUser, {
      method: 'PUT',
      headers: {
        ...secureHeader(token),
        ...applicationJsonHeader(),
      },
      body: JSON.stringify({ id: userId, username, firstName, lastName, email, companyName, phoneNumber }),
    })
    .then(
      ({ data: user, err: userErr }) => {
        if (userErr) {
          return Promise.reject('I can\'t update the user info');
        }
        dispatch(userInfo(user));
        dispatch(updateUserSuccess());
        return Promise.resolve(user);
      }
    )
    .catch(() => {
      const msg = 'The user information can\'t be updated';
      dispatch(updateUserError(msg));
      return Promise.reject(msg);
    });
  };
}
