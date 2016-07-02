import request from './request';
import URI from 'urijs';
import { formatDate } from '../utils/utils';
import constants from '../constants';


export function generateURL(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (process.env.NODE_ENV === 'production') {
    return `http://api-test.unidesq.com${adjustedPath}`;
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
export function getCampaignPerfomanceData({ status, start, end, frequency, token }) {
  const uri = new URI(generateURL('campaigns/performance')).search({ status, start: formatDate(start), end: formatDate(end), frequency }).toString();
  return request(uri, { headers: { ...secureHeader(token) } })
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

export function getCampaignData({ status, start, end, frequency, token }) {
  const uri = new URI(generateURL('campaigns')).search({ performance: true, status, start: formatDate(start), end: formatDate(end), frequency }).toString();
  return request(uri, { headers: { ...secureHeader(token) } })
    .then(({ data, err }) => {
      if (err) {
        console.log(err);
        return Promise.reject(constants.ERROR_TYPE.SERVER_ERROR);
      }
      console.log('getCampaignData');
      console.log({ status, start, end, frequency, token });
      console.log(data);
      return Promise.resolve(data);
    });
}

export function toggleCampaignStatus({ campaignId, token }) {
  const uri = generateURL(`campaigns/${campaignId}/toggleStatus`);
  return request(uri, { headers: { ...secureHeader(token) }, method: 'PUT' })
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
