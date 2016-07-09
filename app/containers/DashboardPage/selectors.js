import { name } from './__init__';
import { createSelector } from 'reselect';
import { getDayAndMonth, getHour, setColorAlpha, getDayAndMonthFromDate, addDaysToDate } from '../../utils/utils';
import constants from '../../constants';

/* UTILITY FUNCTIONS */

function getHeaders(campaignPerformance, force) {
  const optionalHeaders = Object.keys(constants.KPI)
    .map(kpi => (campaignPerformance.hasOwnProperty(constants.KPI[kpi].key) || force) ? constants.KPI[kpi].key : undefined) // eslint-disable-line no-confusing-arrow
    .filter(it => !!it);

  return [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS, constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN, ...optionalHeaders];
}

function getKPISummaryValue(performanceByKPIs, summaryKPIValues, kpi) {
  /* if there's no data from the performance data, then 0 should be shown in order to not confuse the user
   * this should never happen if the API is working properly */
  if (!performanceByKPIs.hasOwnProperty(constants.KPI[kpi].key)) {
    return 0;
  }
  return summaryKPIValues[constants.KPI[kpi].key];
}

function calculateKPISummaryValue(key, campaignDataSum) {
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
      return null;
  }
}

function calculateKPISummaryValues(campaignData, status) {
  /* We perform a summation of all kpi / campaign data values without doing any grouping */
  const campaignDataSUM = campaignData
    .filter(campaign => status === constants.STATUS.ALL ? true : status === campaign.status) // eslint-disable-line no-confusing-arrow
    .reduce((performanceA, { performance: performanceB }) => {
      for (const kpi in performanceA) { // eslint-disable-line no-restricted-syntax
        if (performanceB.hasOwnProperty(kpi)) {
          performanceA[kpi] = performanceA[kpi] + performanceB[kpi]; // eslint-disable-line no-param-reassign
        }
      }
      return performanceA;
    }, Object.values(constants.KPI).reduce((accumulator, { key: kpi }) => { accumulator[kpi] = 0; return accumulator; }, {})); // eslint-disable-line no-param-reassign

  /* We then build an object/map listing all summary kpi values calculating them each by using the corresponding formula */
  return Object.keys(campaignDataSUM).reduce((accumulator, kpi) => { accumulator[kpi] = calculateKPISummaryValue(kpi, campaignDataSUM); return accumulator; }, {}); // eslint-disable-line no-param-reassign
}

function calculateKPIVariation(key, current, previous) {
  return current[key] && (current[key] - previous[key]) / previous[key] || 0;
}

/* UTILITY FUNCTIONS */

export const getModelSelector = (state) => state.get(name);

export const propsSelector = (state, props) => props;

export const intlSelector = createSelector(
  propsSelector,
  props => (props && props.intl)
);

export const errorSelector = createSelector(
  getModelSelector,
  model => (model.get('error'))
);

export const loadingSelector = createSelector(
  getModelSelector,
  model => (model.get('loading'))
);

export const activeKPIsSelector = createSelector(
  getModelSelector,
  model => (model.get('activeKPIs') ? model.get('activeKPIs').toJS() : null)
);

export const campaignStatusSelector = createSelector(
  getModelSelector,
  model => (model.get('status'))
);

export const campaignFrequencySelector = createSelector(
  getModelSelector,
  model => (model.get('frequency'))
);

export const selectedCampaignSelector = createSelector(
  getModelSelector,
  model => (model.get('selectedCampaign'))
);

export const campaignDataSelector = createSelector(
  getModelSelector,
  model => (model.get('campaignData'))
);

export const campaignPerformanceDataSelector = createSelector(
  getModelSelector,
  model => (model.get('campaignPerformanceData'))
);

export const previousCampaignDataSelector = createSelector(
  getModelSelector,
  model => (model.get('previousCampaignData'))
);

export const fromSelector = createSelector(
  getModelSelector,
  model => (model.get('from'))
);

export const toSelector = createSelector(
  getModelSelector,
  model => (model.get('to'))
);

export const rangeSelector = createSelector(
  fromSelector,
  toSelector,
  (from, to) => ({ from, to })
);

export const toggledCampaignSelector = createSelector(
  getModelSelector,
  model => (model.get('toggledCampaign'))
);


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

    const getValue = (data, type) => (typeof data.performance[type] !== 'undefined' && data.performance[type] !== null ?
        data.performance[type] :
        null
    );
    const campaignDataKeys = Object.keys(campaignDataMap);
    const filteredData = {};
    // We loop through all campaigns filtering and building the row list that feeds the campaign table
    campaignDataKeys.forEach(key => {
      const data = campaignDataMap[key];
      // We filtered all campaigns by status, but, we preserve campaigns whose status is changing / or failed to change (happens when clicking on the toggle status switch)
      if (status === constants.STATUS.ALL || data.changed !== 'success' || status === data.status) {
        filteredData[data.id] = {
          [constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS]: data.status && data.status === constants.STATUS.ACTIVE,
          [constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN]: { // We pass several campaign object properties as we need them it on the the table for multiple rows
            id: data.id,
            name: data.name,
            startData: data.startData,
            endDate: data.endDate,
            budget: data.budget,
            budgetRemaining: data.budgetRemaining,
            currency: data.currency,
            changed: typeof data.changed !== 'undefined' ? data.changed : false,
          },
          ...Object.keys(constants.KPI).reduce((accumulator, kpi) => { accumulator[constants.KPI[kpi].key] = getValue(data, constants.KPI[kpi].key, constants.KPI[kpi].valueType); return accumulator; }, {}), // eslint-disable-line no-param-reassign
        };
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
  (to, from) => ({ to, from }),
);

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
      campaignDataMap = { [selectedCampaign.id]: currentCampaignDataMap[selectedCampaign.id] };
    }
    const campaignData = Object.values(campaignDataMap);
    /* TODO: Currently defining general currency based on the value of the first campaign, this may be a problem if the response campaigns have mixed currencies */
    const currency = campaignData[0] && campaignData[0].currency || 'EUR';
    /*  Previous campaign data corresponds to all data the campaigns had  in the previous period.
    *   e.g If we request Feb data, then Previous campaign data, will hold Jan data.
    */
    let previousCampaignDataMap = selectedPreviousCampaignDataMap;
    if (selectedCampaign && selectedPreviousCampaignDataMap.hasOwnProperty(selectedCampaign.id)) {
      previousCampaignDataMap = { [selectedCampaign.id]: selectedPreviousCampaignDataMap[selectedCampaign.id] };
    }
    const previousCampaignData = Object.values(previousCampaignDataMap);

    /* CALCULATE CHART DATA */
    const performanceAccumulator = {};
    const campaigns = {};
    /* We loop through each performance data item, the API gives performance data for each range of period (1h / 1day, depending on config)
    *  and for each campaign, so we group all value for all campaigns in a given time period, e.g. we sum all impressions of all campaigns
    *  for each day, or simply said, we aggregate by time period (or x-axis value)
    */
    campaignPerformanceData
      .forEach(({ campaignId, date, ...kpiValues }) => {
        if (!campaignDataMap.hasOwnProperty(campaignId) || (status === constants.STATUS.ALL ? false : campaignDataMap[campaignId].status !== status)) {
          return;
        }
        campaigns[campaignId] = true;
        Object.keys(kpiValues).forEach(kpi => {
          if (!performanceAccumulator.hasOwnProperty(date)) {
            performanceAccumulator[date] = {};
            performanceAccumulator[date].campaigns = {};
          }
          if (!performanceAccumulator[date].hasOwnProperty(kpi)) {
            performanceAccumulator[date][kpi] = 0;
          }
          performanceAccumulator[date].campaigns[campaignId] = true;
          performanceAccumulator[date][kpi] += parseFloat(kpiValues[kpi]) || 0;
        });
      });

    /* Once all primordial values are aggregated (impressions, clicks, orders, etc) we set all other derived values using their corresponding formulas
     * We build and array of values for each KPI, the sized of it must be of the same size of the x-axis values, because this is the type of input
     * the chart expects (x/y values both in form of arrays of identical size) */
    const performanceByKPIs = {};
    Object.values(performanceAccumulator).forEach(data => {
      Object.keys(data).forEach(kpi => {
        if (!performanceByKPIs.hasOwnProperty(kpi)) {
          performanceByKPIs[kpi] = [];
        }
        performanceByKPIs[kpi].push(calculateKPISummaryValue(kpi, data));
      });
    });

    /*
     *  We try to build the chart x-axis labels by looking at the time periods of the responses.
     *  We do this, to ensure that what is charted actually corresponds with the API response
     *  and do not build them automatically from the ranges given (e.g. 365 days label for a
     *  request which spans a year, when the API may give me only two months worth of data)
     */
    let labels = [];
    if (frequency === constants.FREQUENCY.DAILY) {
      labels = Object.keys(performanceAccumulator).map(date => getDayAndMonth(date));
    } else if (frequency === constants.FREQUENCY.HOURLY) {
      labels = Object.keys(performanceAccumulator).map(date => getHour(date));
    }
    /*
     *  If there is no labels (e.g. no campaign data) we produce some default labels so the chart
     *  won't show empty which is aesthetically displeasing, although correct
     */
    if (labels.length === 0) {
      if (frequency === constants.FREQUENCY.DAILY) {
        let dateIdx = range.from;
        while (dateIdx.getTime() < range.to.getTime()) {
          labels.push(getDayAndMonthFromDate(dateIdx));
          dateIdx = addDaysToDate(dateIdx, 1);
        }
      } else if (frequency === constants.FREQUENCY.HOURLY) {
        labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
      }
    }

    /* We build the Chart Data object, following the chart library (chartjs) data structure. */
    const chartData = {
      labels,
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

    /* CALCULATE KPI SUMMARY VALUES UNDER CHART */

    /* We calculate kpi summary values for all previous campaign data (this is necessary for variations) */
    const previousSummaryKPIValues = calculateKPISummaryValues(previousCampaignData, status);

    /* We calculate kpi summary values for all current campaign data */
    const summaryKPIValues = calculateKPISummaryValues(campaignData, status);

    /* We calculate kpi variation values for all kpi summary values in the current period */
    const changes = Object.keys(constants.KPI).map(kpi => calculateKPIVariation(constants.KPI[kpi].key, summaryKPIValues, previousSummaryKPIValues));

    /* We build a map/object describing the KPI summary value button state, color, value, variation, enabled/disabled etc. */
    const KPIValues = {};
    Object.keys(constants.KPI).forEach((kpi, idx) => {
      KPIValues[constants.KPI[kpi].key] = {
        label: constants.KPI[kpi].name,
        color: constants.KPI[kpi].color,
        colorHovered: constants.KPI[kpi].colorHovered,
        value: getKPISummaryValue(performanceByKPIs, summaryKPIValues, kpi),
        change: changes[idx],
        enabled: performanceByKPIs.hasOwnProperty(constants.KPI[kpi].key) && constants.KPI[kpi].enabled,
        valueType: constants.KPI[kpi].valueType,
      };
    });
    /* CALCULATE KPI SUMMARY VALUES UNDER CHART */
    return { KPIValues, chartData, currency };
  }
);

