import { fromJS } from 'immutable';
import { name } from './__init__';
import { dateDiffInDays, addDaysToDate } from '../../utils/utils';
import constants from '../../constants';
import moment from 'moment';
import { getCampaignPerfomanceData as getCampaignPerfomanceDataFromAPI, getCampaignData as getCampaignDataFromAPI, toggleCampaignStatus } from '../../utils/unidesqApi';

const LOAD_CAMPAIGN_DATA = `${name}/LOAD_CAMPAIGN_DATA`;
const LOAD_CAMPAIGN_DATA_SUCCESS = `${name}/LOAD_CAMPAIGN_DATA_SUCCESS`;
const LOAD_CAMPAIGN_DATA_ERROR = `${name}/LOAD_CAMPAIGN_DATA_ERROR`;
const CHANGE_DATE_RANGE = `${name}/CHANGE_DATE_RANGE`;
const CHANGE_CAMPAIGN_FILTER_STATUS = `${name}/CHANGE_CAMPAIGN_FILTER_STATUS`;
const CHANGE_SELECTED_CAMPAIGN = `${name}/CHANGE_SELECTED_CAMPAIGN`;
const LOAD_CHANGE_CAMPAIGN_STATUS = `${name}/LOAD_CHANGE_CAMPAIGN_STATUS`;
const LOAD_CHANGE_CAMPAIGN_STATUS_SUCCESS = `${name}/LOAD_CHANGE_CAMPAIGN_STATUS_SUCCESS`;
const LOAD_CHANGE_CAMPAIGN_STATUS_ERROR = `${name}/LOAD_CHANGE_CAMPAIGN_STATUS_ERROR`;
const TOGGLE_KPI = `${name}/TOGGLE_KPI`;

function getInitialDateRange() {
  const now = moment().startOf('day');
  return {
    to: new Date(now.toDate()),
    from: new Date(now.subtract(7, 'day').toDate()),
  };
}

const initialRange = getInitialDateRange();

export const initialState = fromJS({
  timeFrame: constants.TIMEFRAME.YESTERDAY,
  activeKPIs: [constants.KPI.IMPRESSIONS.key, constants.KPI.CLICKS.key],
  status: constants.STATUS.ACTIVE,
  frequency: constants.FREQUENCY.DAILY,
  campaignPerformanceData: false,
  campaignData: false,
  to: initialRange.to,
  selectedCampaign: null,
  from: initialRange.from,
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
      const previousCampaignDataMap = action.previousCampaignData.reduce((map, data) => ({ [data.id]: data, ...map }), {});
      return state
        .set('loading', false)
        .set('campaignPerformanceData', action.campaignPerformanceData)
        .set('campaignData', campaignDataMap)
        .set('previousCampaignData', previousCampaignDataMap);
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
    case TOGGLE_KPI: {
      let activeKPIs = state.get('activeKPIs');
      const kpiIndex = activeKPIs.indexOf(action.kpi);
      if (kpiIndex !== -1) {
        activeKPIs = activeKPIs.delete(kpiIndex);
      } else {
        activeKPIs = activeKPIs.push(action.kpi);
      }
      return state
        .set('activeKPIs', activeKPIs);
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
function getAllCampaigns(store, { call, to, from, frequency }) {
  const requestActiveCampaigns = call(store, { status: constants.STATUS.ACTIVE, end: to, start: from, frequency });
  const requestInactiveCampaigns = call(store, { status: constants.STATUS.INACTIVE, end: to, start: from, frequency });
  return new Promise((resolve, reject) => {
    Promise
      .all([requestActiveCampaigns, requestInactiveCampaigns])
      .then(([activeCampaigns, inactiveCampaigns]) => {
        resolve([...activeCampaigns, ...inactiveCampaigns]);
      })
      .catch((err) => {
        console.log('ERROR');
        console.log(err);
        const error = new Error(constants.ERROR_TYPE.SERVER_ERROR);
        reject(error);
      });
  });
}

function fetchPreviousCampaignData(store, { status, to, from, frequency }) {
  const daysBetweenDates = dateDiffInDays(to, from);
  const previousFrom = addDaysToDate(from, daysBetweenDates - 1);
  const previousTo = addDaysToDate(from, -1);
  if (status === constants.STATUS.ALL) {
    return getAllCampaigns(store, { call: getCampaignDataFromAPI, to: previousTo, from: previousFrom, frequency });
  }
  return getCampaignDataFromAPI(store, { status, end: previousTo, start: previousFrom, frequency });
  // return new Promise(resolve => setTimeout(() => resolve(dummyCampaignData), 1000));
  // return new Promise((resolve, reject) => setTimeout(() => reject(new Error('fetchCampaignData')), 1000));
}

function fetchCampaignData(store, { status, to, from, frequency }) {
  if (status === constants.STATUS.ALL) {
    return getAllCampaigns(store, { call: getCampaignDataFromAPI, to, from, frequency });
  }
  return getCampaignDataFromAPI(store, { status, end: to, start: from, frequency });
  // return new Promise(resolve => setTimeout(() => resolve(dummyCampaignData), 1000));
  // return new Promise((resolve, reject) => setTimeout(() => reject(new Error('fetchCampaignData')), 1000));
}

function fetchCampaignPerformanceData(store, { status, to, from, frequency }) {
  if (status === constants.STATUS.ALL) {
    return getAllCampaigns(store, { call: getCampaignPerfomanceDataFromAPI, to, from, frequency });
  }

  return getCampaignPerfomanceDataFromAPI(store, { status, end: to, start: from, frequency });
  /*
  if (filters.frequency === constants.FREQUENCY.DAILY) {
    return new Promise(resolve => setTimeout(() => resolve(dummyCampaignPerfomanceData), 1000));
  }
  return new Promise(resolve => setTimeout(() => resolve(dummyCampaignPerfomanceHourlyData), 1000));
  */
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
  const filters = getState().get(name).toJS();
  const requestCampaignData = fetchCampaignData({ dispatch, getState }, filters);
  const requestPreviousCampaignData = fetchPreviousCampaignData({ dispatch, getState }, filters);
  const requestCampaignPerformanceData = fetchCampaignPerformanceData({ dispatch, getState }, filters);
  Promise.all([requestCampaignData, requestCampaignPerformanceData, requestPreviousCampaignData])
    .then(([campaignData, campaignPerformanceData, previousCampaignData]) => {
      dispatch(loadedCampaignData({ campaignData, campaignPerformanceData, previousCampaignData }));
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
    //refreshCampaignData(dispatch, getState);
  };
}

export function resetDateRange() {
  return (dispatch) => {
    const range = getInitialDateRange();
    dispatch(changeDateRange(range));
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
    if (getState().get(name).get('status') === status) {
      dispatch(changeCampaignStatusFilterState(status));
      return;
    }
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
function requestChangeCampaignStatus(store, campaignId) { // eslint-disable-line no-unused-vars
  return toggleCampaignStatus(store, { campaignId });
  // return new Promise(resolve => setTimeout(() => resolve(null), 1000));
  // return new Promise((resolve, reject) => setTimeout(() => reject(new Error('burgy')), 1000));
}

function changeCampaignStatus(campaignId, value) {
  return (dispatch, getState) => {
    const status = value ? constants.STATUS.ACTIVE : constants.STATUS.INACTIVE;
    dispatch(loadChangeCampaignStatus(campaignId, status));
    requestChangeCampaignStatus({ dispatch, getState }, campaignId)
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

export function toggleKPI(kpi) {
  return {
    type: TOGGLE_KPI,
    kpi,
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
  TOGGLE_KPI,
  changeDateRange,
  resetDateRange,
  getCampaignData,
  changeCampaignStatusFilter,
  changeSelectedCampaignFilter,
  changeCampaignStatus,
  toggleKPI,
};
