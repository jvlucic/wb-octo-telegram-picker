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

