/* eslint-disable */
import { name } from './__init__';
import { createSelector } from 'reselect';
import constants from '../../constants';

export const getModelSelector = (state) => state.get(name);

function getRandomNumberArray(size) {
  return new Array(size).fill(0).map(() => Math.round(Math.random() * 255));
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

export const campaignDataSelector = createSelector(
  getModelSelector,
  model => ( model.get('campaignData') )
);

export const campaignperformanceDataSelector = createSelector(
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
    if (performance.hasOwnProperty('impressions')){ headers.push(constants.KPI.IMPRESSIONS.key) }
    if (performance.hasOwnProperty('clicks')){ headers.push(constants.KPI.CLICKS.key) }
    if (performance.hasOwnProperty('CTR')){ headers.push(constants.KPI.CTR.key) }
    if (performance.hasOwnProperty('conversion')){ headers.push(constants.KPI.CONVERSION.key) }
    if (performance.hasOwnProperty('CVR')){ headers.push(constants.KPI.CVR.key) }
    if (performance.hasOwnProperty('CPM')){ headers.push(constants.KPI.CPM.key) }
    if (performance.hasOwnProperty('CPC')){ headers.push(constants.KPI.CPC.key) }
    if (performance.hasOwnProperty('CPO')){ headers.push(constants.KPI.CPO.key) }
    if (performance.hasOwnProperty('cost')){ headers.push(constants.KPI.COST.key) }
    if (performance.hasOwnProperty('orderValue')){ headers.push(constants.KPI.ORDER_VALUE.key) }
    if (performance.hasOwnProperty('ROI')){ headers.push(constants.KPI.ROI.key) }
    return headers;
  }
);


export const campaignTableListSelector = createSelector(
  campaignDataSelector,
  (campaignData) => {
    if (!campaignData) {
      return false;
    }

    return campaignData.map( data => ({
      [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS]: data.status && data.status === "active" ? true : false,
      [constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN]: { name: data.name, startData: data.startData, endDate: data.endDate, budget: data.budget, currency:data.currency } || null,
      [constants.KPI.IMPRESSIONS.key]: data.performance.impressions || null,
      [constants.KPI.CLICKS.key]: data.performance.clicks || null,
      [constants.KPI.CTR.key]: data.performance.CTR || null,
      [constants.KPI.CONVERSION.key]: data.performance.conversion || null,
      [constants.KPI.CVR.key]: data.performance.CVR || null,
      [constants.KPI.CPM.key]: data.performance.CPM || null,
      [constants.KPI.CPC.key]: data.performance.CPC || null,
      [constants.KPI.CPO.key]: data.performance.CPO || null,
      [constants.KPI.COST.key]: data.performance.cost || null,
      [constants.KPI.ORDER_VALUE.key]: data.performance.orderValue || null,
      [constants.KPI.ROI.key]: data.performance.ROI || null,
    }));
  }
);

export const KPIDataSelector = createSelector(
  getModelSelector,
  model => {
    const campaignData = model.get('campaignData');
    const campaignPerformanceData = model.get('campaignPerformanceData');
    const activeKPIs = model.get('activeKPIs');
    if (!campaignData || !campaignPerformanceData) {
      return null;
    }
    /* TODO: PROCESS RAW DATA AND PRODUCES KPI AND CHART DATA*/
    const chartData = {
      labels: new Array(24).fill(0).map((elem, idx) => idx),
      datasets: getRandomDataSets(),
    };
    const dummyValues = [534000, 1234, 0.0035, 800, 0.1143, 0.4, 0.4, 8.75, 8.75, 350000, 28000, 3];
    const dummyChanges = [3, 3, 0, -3, 3, 3, 3, 3, 3, 3, 3, 3];
    const KPIValues = {};
    const constantine = constants;
    Object.keys(constantine.KPI).forEach( (kpi, idx) => {
      KPIValues[kpi] = {
        label: constants.KPI[kpi].name,
        color: constants.KPI[kpi].color,
        colorHovered: constants.KPI[kpi].colorHovered,
        value: dummyValues[idx],
        change: dummyChanges[idx],
        enabled: constants.KPI[kpi].enabled,
        valueType: constants.KPI[kpi].valueType,
      }
    });
    return {KPIValues, chartData, activeKPIs: activeKPIs.toJS()};
  }
);

