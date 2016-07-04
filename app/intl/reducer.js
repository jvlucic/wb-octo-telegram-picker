/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  CHANGE_LOCALE_SUCCESS,
  CHANGE_LOCALE,
  CHANGE_LOCALE_ERROR,
} from './constants';
import { fromJS } from 'immutable';
import enMessages from 'intl/messages/en';
import appConstants from '../constants';

// The initial state of the App
const initialState = fromJS({
  locale: appConstants.FALLBACK_LOCALE,
  messages: enMessages,
  loading: false,
});

/**
 * Reducer of Intl utilities
 * @param  {Object} state   - Current state of the application for default is the initial state
 * @param  {Object} action  - Current action dispatched
 * @return {Object}         - New state
 */
function intlReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state
        .set('loading', true);
    case CHANGE_LOCALE_SUCCESS:
      return state
        .set('loading', false)
        .set('locale', action.locale)
        .set('messages', action.messages);
    case CHANGE_LOCALE_ERROR:
      return state
        .set('loading', false);
    default:
      return state;
  }
}

export default intlReducer;
