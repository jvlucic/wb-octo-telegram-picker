import request from './request';
import URI from 'urijs';
import { formatDate } from '../utils/utils';
import constants from '../constants';
import { selectToken } from 'auth/selectors';
import { logout } from 'auth/actions';
import { push } from 'react-router-redux';
import config from 'config'; // eslint-disable-line import/no-unresolved

export function generateURL(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (process.env.NODE_ENV === 'production') {
    return `${config.apiUrl}${adjustedPath}`;
  }
  return `http://localhost:3000/api/${adjustedPath}`;
}

export function secureHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function applicationJsonHeader() {
  return {
    'Content-type': 'application/json; charset=UTF-8',
  };
}

export function secureRequest({ getState, dispatch }, uri, options = {}) {
  const { headers = {} } = options;
  const token = selectToken(getState());
  if (!token) {
    dispatch(push('login'));
    const unauthenticated = new Error('The user is not authenticated.');
    unauthenticated.response = { status: 401 };
    return Promise.reject(unauthenticated);
  }
  return request(uri, {
    ...options,
    headers: {
      ...headers,
      ...secureHeader(token),
    },
  })
  .then(response => {
    const { err } = response;
    if (err && err.response && err.response.status === 401) {
      dispatch(logout());
    }
    return response;
  });
}

export function getCampaignPerfomanceData(store, { status, start, end, frequency }) {
  const uri = new URI(generateURL('campaigns/performance')).search({ status, start: formatDate(start), end: formatDate(end), frequency }).toString();
  return secureRequest(store, uri)
    .then(({ data, err }) => {
      if (err) {
        console.log(err);
        return Promise.reject(constants.ERROR_TYPE.SERVER_ERROR);
      }
      console.log('getCampaignPerfomanceData');
      console.log(data);
      return Promise.resolve(data);
    });
}

export function getCampaignData(store, { status, start, end, frequency }) {
  const uri = new URI(generateURL('campaigns')).search({ performance: true, status, start: formatDate(start), end: formatDate(end), frequency }).toString();
  return secureRequest(store, uri)
    .then(({ data, err }) => {
      if (err) {
        console.log(err);
        return Promise.reject(constants.ERROR_TYPE.SERVER_ERROR);
      }
      console.log('getCampaignData');
      console.log({ status, start, end, frequency });
      console.log(data);
      return Promise.resolve(data);
    });
}

export function toggleCampaignStatus(store, { campaignId }) {
  const uri = generateURL(`campaigns/${campaignId}/toggleStatus`);
  return secureRequest(store, uri, { method: 'PUT' })
    .then(({ data, err }) => {
      if (err) {
        console.log(err);
        return Promise.reject(constants.ERROR_TYPE.SERVER_ERROR);
      }
      console.log('toggledStatus');
      console.log(data);
      return Promise.resolve(data);
    });
}
