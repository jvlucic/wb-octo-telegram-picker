
import {
  CHANGE_LOCALE,
  CHANGE_LOCALE_SUCCESS,
  CHANGE_LOCALE_ERROR,
} from './constants';
import { loadPolyfillAndData } from 'intl/intUtils';

/**
 * Private function to retrieve the message from the respective module
 * @param  {string} locale      - Locale of the messages
 * @return {Promise.<Object>}   - Promise that resolve the messages
 */
function retrieveMessages(locale) {
  switch (locale) {
    case 'es': {
      return System.import('intl/messages/es');
    }
    default: {
      return System.import('intl/messages/en');
    }
  }
}

/**
 * CHANGE_LOCALE action creation
 * @return {Object}        - Action
 */
export function changeLocal() {
  return {
    type: CHANGE_LOCALE,
  };
}

/**
 * Action creator for CHANGE_LOCALE_SUCCESS
 * @param  {string} locale      - Locale that want change
 * @param  {*} error            - Error that happen when was changing the locale
 * @return {Object}             - Action of CHANGE_LOCALE_SUCCESS
 * @property {string} type      - CHANGE_LOCALE_SUCCESS
 * @property {string} locale    - Locale to change
 * @property {Object} message   - Object with the new messages
 */
export function changeLocalSuccess(locale, message) {
  return {
    type: CHANGE_LOCALE_SUCCESS,
    locale,
    message,
  };
}

/**
 * Action creator for CHANGE_LOCALE_ERROR
 * @param  {*} error  - Error that happen when was changing the locale
 * @return {Object}   - Action of CHANGE_LOCALE_ERROR
 * @property {string} type   - CHANGE_LOCALE_ERROR
 * @property {*} error   - Error to pass the reducer
 */
export function changeLocalError(error) {
  return {
    type: CHANGE_LOCALE_ERROR,
    error,
  };
}

/**
 * Change the language of application
 * @param  {string} locale - Language to change
 * @return {Promise}       - Promise that resolve when all the call is made
 */
export function changeLocale(locale) {
  return (dispatch) => {
    dispatch(changeLocal());
    return loadPolyfillAndData(locale)
      .then(() => retrieveMessages(locale))
      .then(
        messages => dispatch(changeLocalSuccess(locale, messages)),
        error => dispatch(changeLocalError(error)),
      );
  };
}
