/* eslint-disable */
import {name} from './__init__';
import {createSelector} from 'reselect';
import constants from '../../constants';
import {getDayAndMonth, getHour, setColorAlpha, getDayAndMonthFromDate, addDaysToDate} from '../../utils/utils';

export const getModelSelector = (state) => state.get(name);

export const errorSelector = createSelector(
  getModelSelector,
  model => ( model.get('error') )
);

export const loadingSelector = createSelector(
  getModelSelector,
  model => ( model.get('loading') )
);

export const activeKPIsSelector = createSelector(
  getModelSelector,
  model => ( model.get('activeKPIs') ? model.get('activeKPIs').toJS() : null )
);

export const campaignStatusSelector = createSelector(
  getModelSelector,
  model => ( model.get('status') )
);

export const campaignFrequencySelector = createSelector(
  getModelSelector,
  model => ( model.get('frequency') )
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

export const previousCampaignDataSelector = createSelector(
  getModelSelector,
  model => ( model.get('previousCampaignData') )
);

export const rangeSelector = createSelector(
  getModelSelector,
  model => ( {from: model.get('from'), to: model.get('to')})
);

export const toggledCampaignSelector = createSelector(
  getModelSelector,
  model => ( model.get('toggledCampaign'))
);

function getHeaders(campaignPerformance, force) {
  const headers = [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS, constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN];
  if (campaignPerformance.hasOwnProperty('impressions') || force) {
    headers.push(constants.KPI.IMPRESSIONS.key)
  }
  if (campaignPerformance.hasOwnProperty('clicks') || force) {
    headers.push(constants.KPI.CLICKS.key)
  }
  if (campaignPerformance.hasOwnProperty('ctr') || force) {
    headers.push(constants.KPI.CTR.key)
  }
  if (campaignPerformance.hasOwnProperty('conversion') || force) {
    headers.push(constants.KPI.CONVERSION.key)
  }
  if (campaignPerformance.hasOwnProperty('cvr') || force) {
    headers.push(constants.KPI.CVR.key)
  }
  if (campaignPerformance.hasOwnProperty('cpm') || force) {
    headers.push(constants.KPI.CPM.key)
  }
  if (campaignPerformance.hasOwnProperty('cpc') || force) {
    headers.push(constants.KPI.CPC.key)
  }
  if (campaignPerformance.hasOwnProperty('cpo') || force) {
    headers.push(constants.KPI.CPO.key)
  }
  if (campaignPerformance.hasOwnProperty('orderValue') || force) {
    headers.push(constants.KPI.ORDER_VALUE.key)
  }
  if (campaignPerformance.hasOwnProperty('roi') || force) {
    headers.push(constants.KPI.ROI.key)
  }
  return headers;
}

export const campaignTableHeadersSelector = createSelector(
  campaignDataSelector,
  (campaignDataMap) => {
    if (!campaignDataMap) {
      return false;
    }
    /* TODO: get a more efficient way of obtaining an element */
    const campaignData = Object.values(campaignDataMap);
    if (campaignData.length > 0) {
      const performance = campaignData[0].performance; // determine headers from first value
      return getHeaders(performance);
    }
    return getHeaders({}, true);
  }
);


export const campaignTableListSelector = createSelector(
  campaignDataSelector,
  campaignStatusSelector,
  (campaignDataMap, status) => {
    if (!campaignDataMap) {
      return false;
    }

    const getValue = (data, type) => ( typeof data.performance[type] !== 'undefined' && data.performance[type] !== null ? data.performance[type] : null );
    const campaignDataKeys = Object.keys(campaignDataMap);
    const filteredData = {};
    campaignDataKeys.forEach(key => {
      const data = campaignDataMap[key];
      if ( status === constants.STATUS.ALL || data.changed !== 'success' || status === data.status){
        filteredData[data.id] = {
          [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS]: data.status && data.status === constants.STATUS.ACTIVE ? true : false,
          [constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN]: {
            id: data.id,
            name: data.name,
            startData: data.startData,
            endDate: data.endDate,
            budget: data.budget,
            budgetRemaining: data.budgetRemaining,
            currency: data.currency,
            changed: typeof data.changed !== 'undefined' ? data.changed : false,
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
        }
      } 
    });
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
function getKPISummaryValue(performanceByKPIs, reduced, kpi) {
  if (!performanceByKPIs.hasOwnProperty(constants.KPI[kpi].key)) {
    return 0;
  }
  return reduced[constants.KPI[kpi].key];
}

function calculateKPISummaryValues(key, campaignDataSum) {
  switch (key) {
    case constants.KPI.IMPRESSIONS.key:
      return campaignDataSum[constants.KPI.IMPRESSIONS.key];
    case constants.KPI.CLICKS.key:
      return campaignDataSum[constants.KPI.CLICKS.key];
    case constants.KPI.CONVERSION.key:
      return campaignDataSum[constants.KPI.CONVERSION.key];
    case constants.KPI.ORDER_VALUE.key:
      return campaignDataSum[constants.KPI.ORDER_VALUE.key];
    case constants.KPI.MARGIN.key:
      return campaignDataSum[constants.KPI.MARGIN.key];
    case constants.KPI.CPM.key:
      return campaignDataSum[constants.KPI.IMPRESSIONS.key] && (campaignDataSum[constants.KPI.COST.key] / campaignDataSum[constants.KPI.IMPRESSIONS.key]) * 1000 || 0;
    case constants.KPI.CPC.key:
      return campaignDataSum[constants.KPI.CLICKS.key] && campaignDataSum[constants.KPI.COST.key] / campaignDataSum[constants.KPI.CLICKS.key] || 0;
    case constants.KPI.CPO.key:
      return campaignDataSum[constants.KPI.CONVERSION.key] && campaignDataSum[constants.KPI.COST.key] / campaignDataSum[constants.KPI.CONVERSION.key] || 0;
    case constants.KPI.CTR.key:
      return campaignDataSum[constants.KPI.IMPRESSIONS.key] && (campaignDataSum[constants.KPI.CLICKS.key] / campaignDataSum[constants.KPI.IMPRESSIONS.key]) * 100 || 0;
    case constants.KPI.CVR.key:
      return campaignDataSum[constants.KPI.CLICKS.key] && (campaignDataSum[constants.KPI.CONVERSION.key] / campaignDataSum[constants.KPI.CLICKS.key]) * 100 || 0;
    case constants.KPI.ROI.key:
      return campaignDataSum[constants.KPI.COST.key] && (campaignDataSum[constants.KPI.ORDER_VALUE.key] / campaignDataSum[constants.KPI.COST.key]) * 100 || 0;
    case constants.KPI.COST.key:
      return campaignDataSum[constants.KPI.COST.key];
    default:
      return null
  }
}

function calculateKPIVariation(key, current, previous) {
  return current[key] && ( current[key] - previous[key] ) / previous[key] || 0;
}

export const KPIDataSelector = createSelector(
  campaignDataSelector,
  campaignStatusSelector,
  campaignFrequencySelector,
  campaignPerformanceDataSelector,
  loadingSelector,
  rangeSelector,
  selectedCampaignSelector,
  previousCampaignDataSelector,
  (currentCampaignDataMap, status, frequency, campaignPerformanceData, loading, range, selectedCampaign, selectedPreviousCampaignDataMap) => {
    if (!currentCampaignDataMap || !campaignPerformanceData || loading || !selectedPreviousCampaignDataMap) {
      return null;
    }
    let campaignDataMap = currentCampaignDataMap;
    if (selectedCampaign && currentCampaignDataMap.hasOwnProperty(selectedCampaign.id)) {
      campaignDataMap = { [selectedCampaign.id]: currentCampaignDataMap[selectedCampaign.id] } ;
    }
    const campaignData = Object.values(campaignDataMap);


    let previousCampaignDataMap = selectedPreviousCampaignDataMap;
    if (selectedCampaign && selectedPreviousCampaignDataMap.hasOwnProperty(selectedCampaign.id)) {
      previousCampaignDataMap = { [selectedCampaign.id]: selectedPreviousCampaignDataMap[selectedCampaign.id] } ;
    }
    const KPIValues = {};


    /* CALCULATE CHART DATA */
    const performanceAccumulator = {};
    const campaigns = {};
    campaignPerformanceData
      .forEach(({campaignId, date, ...kpiValues}) => {
        if (!campaignDataMap.hasOwnProperty(campaignId) || (status === constants.STATUS.ALL ? false : campaignDataMap[campaignId].status !== status)) {
          return;
        }
        campaigns[campaignId] = true;
        Object.keys(kpiValues).forEach(kpi => {
          if (!performanceAccumulator.hasOwnProperty(date)) {
            performanceAccumulator[date] = {};
            performanceAccumulator[date]['campaigns'] = {};
          }
          if (!performanceAccumulator[date].hasOwnProperty(kpi)) {
            performanceAccumulator[date][kpi] = 0;
          }
          performanceAccumulator[date]['campaigns'][campaignId] = true;
          performanceAccumulator[date][kpi] += parseFloat(kpiValues[kpi]) || 0;
        })
      });
    /* TODO: handle HOURLY DATA*/
    let labels = [];
    if (frequency === constants.FREQUENCY.DAILY) {
      labels = Object.keys(performanceAccumulator).map(date => getDayAndMonth(date))
    } else if (frequency === constants.FREQUENCY.HOURLY) {
      labels = Object.keys(performanceAccumulator).map(date => getHour(date))
    }
    /* TODO: GET DEFAULT LABEL VALUES */
    if (labels.length === 0) {
      if (frequency === constants.FREQUENCY.DAILY) {
        let dateIdx = range.from;
        while (dateIdx.getTime() !== range.to.getTime()) {
          labels.push(getDayAndMonthFromDate(dateIdx));
          dateIdx = addDaysToDate(dateIdx, 1);
        }
      } else if (frequency === constants.FREQUENCY.HOURLY) {
        labels = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
      }
    }

    const performanceByKPIs = {};

    Object.values(performanceAccumulator).forEach(data => {
      Object.keys(data).forEach(kpi => {
        if (!performanceByKPIs.hasOwnProperty(kpi)) {
          performanceByKPIs[kpi] = [];
        }
        performanceByKPIs[kpi].push(calculateKPISummaryValues(kpi, data));
      })
    });
    const chartData = {
      labels: labels,
      datasets: Object.keys(constants.KPI)
        .filter(kpi => constants.KPI[kpi].enabled && performanceByKPIs.hasOwnProperty(constants.KPI[kpi].key))
        .map(kpi => ({
          kpi: constants.KPI[kpi].key,
          label: constants.KPI[kpi].name,
          data: performanceByKPIs[constants.KPI[kpi].key],
          borderColor: constants.KPI[kpi].color,
          pointBackgroundColor: constants.KPI[kpi].color,
          backgroundColor: setColorAlpha(constants.KPI[kpi].color, 0.2),
          fill: false,
          borderWidth: 1,
        })),
    };


    /* CALCULATE KPI VALUES UNDER CHART */


    const previousCampaignData = Object.values(previousCampaignDataMap);
    const campaignDataSUM = campaignData
      .filter(campaign => status === constants.STATUS.ALL ? true : status === campaign.status)
      .reduce((performanceA, {performance: performanceB}) => {
        for (const kpi in performanceA) {
          if (performanceB.hasOwnProperty(kpi)) {
            performanceA[kpi] = performanceA[kpi] + performanceB[kpi];
          }
        }
        return performanceA;
      }, Object.values(constants.KPI).reduce((accumulator, {key: kpi}) => { accumulator[kpi] = 0; return accumulator }, {}));

    const summaryKPIValues = Object.keys(campaignDataSUM).reduce((accumulator, kpi) => { accumulator[kpi] = calculateKPISummaryValues(kpi, campaignDataSUM); return accumulator }, {});

    const previousCampaignDataSUM = previousCampaignData
      .filter(campaign => status === constants.STATUS.ALL ? true : status === campaign.status)
      .reduce((performanceA, {performance: performanceB}) => {
        for (const kpi in performanceA) {
          if (performanceB.hasOwnProperty(kpi)) {
            performanceA[kpi] = performanceA[kpi] + performanceB[kpi];
          }
        }
        return performanceA;
      }, Object.values(constants.KPI).reduce((accumulator, {key: kpi}) => { accumulator[kpi] = 0; return accumulator }, {}) );

    const previousSummaryKPIValues = Object.keys(previousCampaignDataSUM).reduce((accumulator, kpi) => { accumulator[kpi] = calculateKPISummaryValues(kpi, previousCampaignDataSUM); return accumulator }, {});

    /* TODO: PROCESS RAW DATA AND PRODUCES KPI AND CHART DATA*/
    // const dummyChanges = [3, 3, 0, -3, 3, 3, 3, 3, 3, 3, 3, 3];
    // const changes = [summary.changeImps, summary.changeClicks, summary.changeCtr, 0, summary.changeCvr, summary.changeCpm, summary.changeCpc, summary.changeCpo, 0, summary.changeValue, summary.changeMargin, summary.changeRoi];
    // const changes = dummyChanges;
    const changes = [
      calculateKPIVariation(constants.KPI.IMPRESSIONS.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CLICKS.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CTR.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CONVERSION.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CVR.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CPM.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CPC.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.CPO.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.COST.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.ORDER_VALUE.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.MARGIN.key, summaryKPIValues, previousSummaryKPIValues),
      calculateKPIVariation(constants.KPI.ROI.key, summaryKPIValues, previousSummaryKPIValues),
    ];

    Object.keys(constants.KPI).forEach((kpi, idx) => {

      KPIValues[constants.KPI[kpi].key] = {
        label: constants.KPI[kpi].name,
        color: constants.KPI[kpi].color,
        colorHovered: constants.KPI[kpi].colorHovered,
        value: getKPISummaryValue(performanceByKPIs, summaryKPIValues, kpi),
        change: changes[idx],
        enabled: performanceByKPIs.hasOwnProperty(constants.KPI[kpi].key) && constants.KPI[kpi].enabled,
        valueType: constants.KPI[kpi].valueType,
      }
    });
    /* CALCULATE KPI VALUES UNDER CHART */

    return {KPIValues, chartData};
  }
);

