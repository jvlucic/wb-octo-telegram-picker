import { fromJS } from 'immutable';
import { name } from './__init__';
import { dateDiffInDays } from '../../utils/utils';
import constants from '../../constants';
import moment from 'moment';

/* TODO: replace dummydata for API calls */
import dummyCampaignData from '../../../unidesq-spec/fixtures/dummyCampaignData.json';
import dummyCampaignPerfomanceData from '../../../unidesq-spec/fixtures/dummyCampaignPerfomanceData.json';
import dummyCampaignPerfomanceHourlyData from '../../../unidesq-spec/fixtures/dummyCampaignPerfomanceHourlyData.json';

const LOAD_CAMPAIGN_DATA = `${name}/LOAD_CAMPAIGN_DATA`;
const LOAD_CAMPAIGN_DATA_SUCCESS = `${name}/LOAD_CAMPAIGN_DATA_SUCCESS`;
const LOAD_CAMPAIGN_DATA_ERROR = `${name}/LOAD_CAMPAIGN_DATA_ERROR`;
const CHANGE_DATE_RANGE = `${name}/CHANGE_DATE_RANGE`;
const CHANGE_CAMPAIGN_FILTER_STATUS = `${name}/CHANGE_CAMPAIGN_FILTER_STATUS`;
const CHANGE_SELECTED_CAMPAIGN = `${name}/CHANGE_SELECTED_CAMPAIGN`;
const LOAD_CHANGE_CAMPAIGN_STATUS = `${name}/LOAD_CHANGE_CAMPAIGN_STATUS`;
const LOAD_CHANGE_CAMPAIGN_STATUS_SUCCESS = `${name}/LOAD_CHANGE_CAMPAIGN_STATUS_SUCCESS`;
const LOAD_CHANGE_CAMPAIGN_STATUS_ERROR = `${name}/LOAD_CHANGE_CAMPAIGN_STATUS_ERROR`;

const now = moment().startOf('day');

export const initialState = fromJS({
  timeFrame: constants.TIMEFRAME.YESTERDAY,
  status: constants.STATUS.ACTIVE,
  frequency: constants.FREQUENCY.DAILY,
  activeKPIs: [constants.KPI.IMPRESSIONS.key, constants.KPI.CLICKS.key],
  campaignPerformanceData: false,
  campaignData: false,
  to: new Date(now.toDate()),
  selectedCampaign: null,
  from: now.subtract(7, 'day').toDate(),
  loading: false,
  toggledCampaign: false,
});


export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CAMPAIGN_DATA:
      return state
        .set('loading', true)
        .set('error', false)
        .set('campaignPerformanceData', false)
        .set('campaignData', false);
    case LOAD_CAMPAIGN_DATA_SUCCESS: {
      const campaignDataMap = action.campaignData.reduce((map, data) => ({ [data.id]: data, ...map }), {});
      return state
        .set('loading', false)
        .set('campaignPerformanceData', action.campaignPerformanceData)
        .set('campaignData', campaignDataMap);
    }
    case LOAD_CAMPAIGN_DATA_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false)
        .set('campaignPerformanceData', [])
        .set('campaignData', {});
    case CHANGE_DATE_RANGE: {
      const daysBetweenDates = dateDiffInDays(action.from, action.to);
      return state
        .set('to', action.to)
        .set('from', action.from)
        .set('frequency', daysBetweenDates <= 1 ? constants.FREQUENCY.HOURLY : constants.FREQUENCY.DAILY);
    }
    case CHANGE_CAMPAIGN_FILTER_STATUS:
      return state
        .set('status', action.status)
        .set('selectedCampaign', null);
    case CHANGE_SELECTED_CAMPAIGN: {
      const currentSelectedCampaign = state.get('selectedCampaign');
      return state
        .set('selectedCampaign', currentSelectedCampaign && currentSelectedCampaign.id === action.campaign.id ? null : action.campaign);
    }
    case LOAD_CHANGE_CAMPAIGN_STATUS: {
      const campaignData = { ...state.get('campaignData') };
      if (campaignData.hasOwnProperty(action.campaignId)) {
        const campaign = campaignData[action.campaignId];
        campaignData[action.campaignId] = { ...campaign, changed: 'loading' };
      }
      return state
        .set('toggledCampaign', action.campaignId)
        .set('campaignData', campaignData);
    }
    case LOAD_CHANGE_CAMPAIGN_STATUS_SUCCESS: {
      const campaignData = { ...state.get('campaignData') };
      if (campaignData.hasOwnProperty(action.campaignId)) {
        const campaign = campaignData[action.campaignId];
        campaignData[action.campaignId] = { ...campaign, changed: 'success', status: action.status };
      }
      return state
        .set('toggledCampaign', action.campaignId)
        .set('campaignData', campaignData);
    }
    case LOAD_CHANGE_CAMPAIGN_STATUS_ERROR: {
      const campaignData = { ...state.get('campaignData') };
      if (campaignData.hasOwnProperty(action.campaignId)) {
        const campaign = campaignData[action.campaignId];
        campaignData[action.campaignId] = { ...campaign, changed: 'error', status: action.status };
      }
      return state
        .set('toggledCampaign', action.campaignId)
        .set('campaignData', campaignData);
    }
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
  // return new Promise((resolve, reject) => setTimeout(() => reject(new Error('fetchCampaignData')), 1000));
}

function fetchCampaignPerformanceData(filters) {
  if (filters.get('frequency') === constants.FREQUENCY.DAILY) {
    return new Promise(resolve => setTimeout(() => resolve(dummyCampaignPerfomanceData), 1000));
  }
  return new Promise(resolve => setTimeout(() => resolve(dummyCampaignPerfomanceHourlyData), 1000));
}

function changeDateRangeState({ to, from }) {
  return {
    type: CHANGE_DATE_RANGE,
    to,
    from,
  };
}

function refreshCampaignData(dispatch, getState) {
  dispatch(loadCampaignData());
  const filters = getState().get(name);
  const requestCampaignData = fetchCampaignData(filters);
  const requestCampaignPerformanceData = fetchCampaignPerformanceData(filters);
  Promise.all([requestCampaignData, requestCampaignPerformanceData])
    .then(([campaignData, campaignPerformanceData]) => {
      dispatch(loadedCampaignData({ campaignData, campaignPerformanceData }));
    })
    .catch((err) => {
      console.log('ERROR');
      console.log(err);
      const error = new Error(constants.ERROR_TYPE.SERVER_ERROR);
      dispatch(loadingError(error));
    });
}

export function changeDateRange({ to, from }) {
  return (dispatch, getState) => {
    dispatch(changeDateRangeState({ to, from }));
    refreshCampaignData(dispatch, getState);
  };
}

function changeCampaignStatusFilterState(status) {
  return {
    type: CHANGE_CAMPAIGN_FILTER_STATUS,
    status,
  };
}

export function changeCampaignStatusFilter(status) {
  return (dispatch, getState) => {
    dispatch(changeCampaignStatusFilterState(status));
    refreshCampaignData(dispatch, getState);
  };
}

export function changeSelectedCampaignFilter(campaign) {
  return {
    type: CHANGE_SELECTED_CAMPAIGN,
    campaign,
  };
}

export function loadChangeCampaignStatus(campaignId, status) {
  return {
    type: LOAD_CHANGE_CAMPAIGN_STATUS,
    campaignId,
    status,
  };
}
export function loadedChangeCampaignStatus(campaignId, status) {
  return {
    type: LOAD_CHANGE_CAMPAIGN_STATUS_SUCCESS,
    campaignId,
    status,
  };
}
export function loadChangeCampaignStatusError(campaignId, status) {
  return {
    type: LOAD_CHANGE_CAMPAIGN_STATUS_ERROR,
    campaignId,
    status,
  };
}
function requestChangeCampaignStatus(campaignId, value) { // eslint-disable-line no-unused-vars
  return new Promise(resolve => setTimeout(() => resolve(null), 1000));
  // return new Promise((resolve, reject) => setTimeout(() => reject(new Error('burgy')), 1000));
}

function changeCampaignStatus(campaignId, value) {
  return (dispatch) => {
    const status = value ? constants.STATUS.ACTIVE : constants.STATUS.INACTIVE;
    dispatch(loadChangeCampaignStatus(campaignId, status));
    requestChangeCampaignStatus(campaignId, value)
      .then(() => {
        dispatch(loadedChangeCampaignStatus(campaignId, status));
      })
      .catch((err) => {
        console.log('ERROR');
        console.log(err);
        const errorStatus = !value ? constants.STATUS.ACTIVE : constants.STATUS.INACTIVE;
        dispatch(loadChangeCampaignStatusError(campaignId, errorStatus));
      });
  };
}

export function getCampaignData() {
  return (dispatch, getState) => {
    refreshCampaignData(dispatch, getState);
  };
}

export const actions = {
  LOAD_CAMPAIGN_DATA,
  LOAD_CAMPAIGN_DATA_SUCCESS,
  LOAD_CAMPAIGN_DATA_ERROR,
  changeDateRange,
  getCampaignData,
  changeCampaignStatusFilter,
  changeSelectedCampaignFilter,
  changeCampaignStatus,
};
