/* eslint-disable */
import {name} from './__init__';
import {createSelector} from 'reselect';
import constants from '../../constants';
import dummyDatasets from '../../../unidesq-spec/fixtures/dummyDatasets.json';

export const getModelSelector = (state) => state.get(name);

function getRandomNumberArray(size) {
  return new Array(size).fill(0).map(() => Math.round(Math.random() * ( Math.random() * 10000 )));
}
function getRandomDataSets() {
  return Object.keys(constants.KPI).map(kpi => ({
    kpi: constants.KPI[kpi].key,
    label: constants.KPI[kpi].name,
    data: getRandomNumberArray(24),
    borderColor: constants.KPI[kpi].color,
    backgroundColor: 'transparent',
    borderWidth: 1,
  }));
}

export const activeKPIsSelector = createSelector(
  getModelSelector,
  model => ( model.get('activeKPIs') )
);

export const campaignStatusSelector = createSelector(
  getModelSelector,
  model => ( model.get('status') )
);

export const selectedCampaignSelector = createSelector(
  getModelSelector,
  model => ( model.get('selectedCampaign') )
);

export const campaignDataSelector = createSelector(
  getModelSelector,
  model => ( model.get('campaignData') )
);

export const campaignPerformanceDataSelector = createSelector(
  getModelSelector,
  model => ( model.get('campaignPerformanceData') )
);

export const campaignTableHeadersSelector = createSelector(
  campaignDataSelector,
  (campaignData) => {
    if (!campaignData) {
      return false;
    }
    const performance = campaignData[0].performance; // determine headers from first value
    const headers = [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS, constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN];
    if (performance.hasOwnProperty('impressions')) {
      headers.push(constants.KPI.IMPRESSIONS.key)
    }
    if (performance.hasOwnProperty('clicks')) {
      headers.push(constants.KPI.CLICKS.key)
    }
    if (performance.hasOwnProperty('ctr')) {
      headers.push(constants.KPI.CTR.key)
    }
    if (performance.hasOwnProperty('conversion')) {
      headers.push(constants.KPI.CONVERSION.key)
    }
    if (performance.hasOwnProperty('cvr')) {
      headers.push(constants.KPI.CVR.key)
    }
    if (performance.hasOwnProperty('cpm')) {
      headers.push(constants.KPI.CPM.key)
    }
    if (performance.hasOwnProperty('cpc')) {
      headers.push(constants.KPI.CPC.key)
    }
    if (performance.hasOwnProperty('cpo')) {
      headers.push(constants.KPI.CPO.key)
    }
    if (performance.hasOwnProperty('orderValue')) {
      headers.push(constants.KPI.ORDER_VALUE.key)
    }
    if (performance.hasOwnProperty('roi')) {
      headers.push(constants.KPI.ROI.key)
    }
    return headers;
  }
);


export const campaignTableListSelector = createSelector(
  campaignDataSelector,
  campaignStatusSelector,
  (campaignData, status) => {
    if (!campaignData) {
      return false;
    }

    const getValue = (data, type) => ( typeof data.performance[type] !== 'undefined' && data.performance[type] !== null ? data.performance[type] : null );
    const filteredData = campaignData.map(data => ({
      [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS]: data.status && data.status === constants.STATUS.ACTIVE ? true : false,
      [constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN]: {
        id: data.id,
        name: data.name,
        startData: data.startData,
        endDate: data.endDate,
        budget: data.budget,
        currency: data.currency
      } || null,
      [constants.KPI.IMPRESSIONS.key]: getValue(data, 'impressions'),
      [constants.KPI.CLICKS.key]: getValue(data, 'clicks'),
      [constants.KPI.CTR.key]: getValue(data, 'ctr'),
      [constants.KPI.CONVERSION.key]: getValue(data, 'conversion'),
      [constants.KPI.CVR.key]: getValue(data, 'cvr'),
      [constants.KPI.CPM.key]: getValue(data, 'cpm'),
      [constants.KPI.CPC.key]: getValue(data, 'cpc'),
      [constants.KPI.CPO.key]: getValue(data, 'cpo'),
      [constants.KPI.ORDER_VALUE.key]: getValue(data, 'orderValue'),
      [constants.KPI.ROI.key]: getValue(data, 'roi'),
    })).filter(
      campaign => status === constants.STATUS.ALL ? true :
        status === constants.STATUS.ACTIVE ? campaign[constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS] : !campaign[constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS]
    );
    return filteredData;
  }
);

const selectToDate = createSelector(
  getModelSelector,
  model => model.get('to'),
);

const selectFromDate = createSelector(
  getModelSelector,
  model => model.get('from'),
);

export const selectRange = createSelector(
  selectToDate,
  selectFromDate,
  (to, from) => ({to, from}),
);
const getKPIFromKey = (key) => {
  switch (key) {
    case constants.KPI.IMPRESSIONS.key:
      return constants.KPI.IMPRESSIONS;
    case constants.KPI.CLICKS.key:
      return constants.KPI.CLICKS;
    case constants.KPI.CTR.key:
      return constants.KPI.CTR;
    case constants.KPI.CONVERSION.key:
      return constants.KPI.CONVERSION;
    case constants.KPI.CVR.key:
      return constants.KPI.CVR;
    case constants.KPI.CPM.key:
      return constants.KPI.CPM;
    case constants.KPI.CPC.key:
      return constants.KPI.CPC;
    case constants.KPI.CPO.key:
      return constants.KPI.CPO;
    case constants.KPI.COST.key:
      return constants.KPI.COST;
    case constants.KPI.ORDER_VALUE.key:
      return constants.KPI.ORDER_VALUE;
    case constants.KPI.MARGIN.key:
      return constants.KPI.MARGIN;
    case constants.KPI.ROI.key:
      return constants.KPI.ROI;
    default:
      return null
  }
};
export const KPIDataSelector = createSelector(
  campaignDataSelector,
  campaignStatusSelector,
  campaignPerformanceDataSelector,
  activeKPIsSelector,
  (campaignData, status, campaignPerformanceData, activeKPIs) => {
    if (!campaignData || !campaignPerformanceData) {
      return null;
    }
    /* TODO: PROCESS RAW DATA AND PRODUCES KPI AND CHART DATA*/
    const chartData = {
      labels: new Array(24).fill(0).map((elem, idx) => idx),
      datasets: dummyDatasets,
    };
    const dummyChanges = [3, 3, 0, -3, 3, 3, 3, 3, 3, 3, 3, 3];
    const KPIValues = {};
    const initialValue = {};
    /* CALCULATE KPI VALUES UNDER CHART */
    Object.values(constants.KPI).forEach(({key: kpi}) => initialValue[kpi] = 0);
    const reduced = campaignData
      .filter(campaign => status === constants.STATUS.ALL ? true : status === campaign.status)
      .reduce((performanceA, {performance: performanceB}) => {
        for (const kpi in performanceA) {
          if (performanceB.hasOwnProperty(kpi)) {
            performanceA[kpi] = performanceA[kpi] + performanceB[kpi];
          }
        }
        return performanceA;
      }, initialValue);
    Object.keys(constants.KPI).forEach((kpi, idx) => {
      KPIValues[constants.KPI[kpi].key] = {
        label: constants.KPI[kpi].name,
        color: constants.KPI[kpi].color,
        colorHovered: constants.KPI[kpi].colorHovered,
        value: constants.KPI[kpi].valueType === constants.VALUE_TYPE.PERCENTAGE ? reduced[constants.KPI[kpi].key] / campaignData.length : reduced[constants.KPI[kpi].key],
        change: dummyChanges[idx],
        enabled: constants.KPI[kpi].enabled,
        valueType: constants.KPI[kpi].valueType,
      }
    });
    /* CALCULATE KPI VALUES UNDER CHART */

    return {KPIValues, chartData, activeKPIs: activeKPIs.toJS()};
  }
);

