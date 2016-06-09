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

    const KPIValues = {
      [constants.KPI.IMPRESSIONS.key]: {
        label: constants.KPI.IMPRESSIONS.name,
        color: constants.KPI.IMPRESSIONS.color,
        value: 534000,
        change: 3,
      },
      [constants.KPI.CLICKS.key]: {
        label: constants.KPI.CLICKS.name,
        color: constants.KPI.CLICKS.color,
        value: 1234,
        change: 3,
      },
      [constants.KPI.CTR.key]: {
        label: constants.KPI.CTR.name,
        color: constants.KPI.CTR.color,
        value: 0.0035,
        change: 0,
      },
      [constants.KPI.CONVERSION.key]: {
        label: constants.KPI.CONVERSION.name,
        color: constants.KPI.CONVERSION.color,
        value: 800,
        change: -3,
      },
      [constants.KPI.CVR.key]: {
        label: constants.KPI.CVR.name,
        color: constants.KPI.CVR.color,
        value: 0.1143,
        change: 3,
      },
      [constants.KPI.CPM.key]: {
        label: constants.KPI.CPM.name,
        color: constants.KPI.CPM.color,
        value: 0.4,
        change: 3,
      },
      [constants.KPI.CPC.key]: {
        label: constants.KPI.CPC.name,
        color: constants.KPI.CPC.color,
        value: 0.4,
        change: 3,
      },
      [constants.KPI.CPO.key]: {
        label: constants.KPI.CPO.name,
        color: constants.KPI.CPO.color,
        value: 8.75,
        change: 3,
      },
      [constants.KPI.ORDER_VALUE.key]: {
        label: constants.KPI.ORDER_VALUE.name,
        color: constants.KPI.ORDER_VALUE.color,
        value: 350000,
        change: 3,
      },
      [constants.KPI.MARGIN.key]: {
        label: constants.KPI.MARGIN.name,
        color: constants.KPI.MARGIN.color,
        value: 28000,
        change: 3,
      },
      [constants.KPI.ROI.key]: {
        label: constants.KPI.ROI.name,
        color: constants.KPI.ROI.color,
        value: 300,
        change: 3,
      },

    };

    return {KPIValues, chartData, activeKPIs: activeKPIs.toJS()};
  }
);

