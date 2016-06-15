import { fromJS } from 'immutable';
import { name } from './__init__';
import constants from '../../constants';
import { CHANGE_DATE_RANGE } from './constants';
import moment from 'moment';

/* TODO: replace dummydata for API calls */
import dummyCampaignData from '../../../unidesq-spec/fixtures/dummyCampaignData.json';
import dummyCampaignPerfomanceData from '../../../unidesq-spec/fixtures/dummyCampaignPerfomanceData.json';

const LOAD_CAMPAIGN_DATA = `${name}/LOAD_CAMPAIGN_DATA`;
const LOAD_CAMPAIGN_DATA_SUCCESS = `${name}/LOAD_CAMPAIGN_DATA_SUCCESS`;
const LOAD_CAMPAIGN_DATA_ERROR = `${name}/LOAD_CAMPAIGN_DATA_ERROR`;

const now = moment().startOf('day');

export const initialState = fromJS({
  timeFrame: constants.TIMEFRAME.YESTERDAY,
  status: constants.STATUS.ACTIVE,
  frequency: constants.FREQUENCY.HOURLY,
  activeKPIs: [constants.KPI.IMPRESSIONS.key, constants.KPI.CLICKS.key],
  campaignPerformanceData: false,
  campaignData: false,
  to: new Date(now.toDate()),
  from: new Date(now.subtract(1, 'week').toDate()),
});


export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CAMPAIGN_DATA:
      return state
        .set('loading', 'true')
        .set('error', false)
        .set('campaignPerformanceData', false)
        .set('campaignData', false);
    case LOAD_CAMPAIGN_DATA_SUCCESS:
      return state
        .set('loading', false)
        .set('campaignPerformanceData', action.campaignPerformanceData)
        .set('campaignData', action.campaignData);
    case LOAD_CAMPAIGN_DATA_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false)
        .set('campaignPerformanceData', false)
        .set('campaignData', false);
    case CHANGE_DATE_RANGE:
      return state
        .set('to', action.to)
        .set('from', action.from);
    default:
      return state;
  }
};

export function loadCampaignData() {
  return {
    type: LOAD_CAMPAIGN_DATA,
  };
}

export function loadedCampaignData(data) {
  return {
    type: LOAD_CAMPAIGN_DATA_SUCCESS,
    ...data,
  };
}

export function loadingError(error) {
  return {
    type: LOAD_CAMPAIGN_DATA_ERROR,
    error,
  };
}


function fetchCampaignData() {
  return new Promise(resolve => setTimeout(() => resolve(dummyCampaignData), 1000));
}

function fetchCampaignPerfomanceData() {
  return new Promise(resolve => setTimeout(() => resolve(dummyCampaignPerfomanceData), 1000));
}

export function getCampaignData() {
  return (dispatch, getState) => {
    dispatch(loadCampaignData());
    const filters = getState().get(name);
    const requestCampaignData = fetchCampaignData(filters);
    const requestCampaignPerformanceData = fetchCampaignPerfomanceData(filters);
    Promise.all([requestCampaignData, requestCampaignPerformanceData])
      .then(([campaignData, campaignPerformanceData]) => {
        dispatch(loadedCampaignData({ campaignData, campaignPerformanceData }));
      })
      .catch((err) => {
        dispatch(loadingError(err));
      });
  };
}

export const actions = {
  LOAD_CAMPAIGN_DATA,
  LOAD_CAMPAIGN_DATA_SUCCESS,
  LOAD_CAMPAIGN_DATA_ERROR,
  getCampaignData,
};
