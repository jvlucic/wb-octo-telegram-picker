/**
 * Created by mongoose on 8/06/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactChartJS from 'react-chartjs';
import styles from './KPIChart.scss';
import KPIButton from 'components/KPIButton';
import constants from '../../constants';

class KPIChart extends Component {
  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/
  constructor(props) {
    super(props);
    this.toggleKPI = this.toggleKPI.bind(this);
    this.toggleHovered = this.toggleHovered.bind(this);
    this.axisToRemove = this.axisToRemove.bind(this);
    let isPercentageAxisActive = false;
    let isNumericValueAxisActive = false;
    const chartData = { ...props.chartData };

    chartData.datasets.forEach(it => {
      const dataSet = it;
      const kpiKey = dataSet.kpi;
      const kpiObj = props.KPIValues[kpiKey];
      dataSet.yAxisID = kpiObj.valueType === constants.VALUE_TYPE.PERCENTAGE ?
        'percentageAxis' :
        'numericValueAxis';

      dataSet.hidden = props.initiallyActiveKPIs.indexOf(dataSet.kpi) < 0;

      if (!isPercentageAxisActive && !dataSet.hidden) {
        isPercentageAxisActive = kpiObj.valueType === constants.VALUE_TYPE.PERCENTAGE;
      }
      if (!isNumericValueAxisActive && !dataSet.hidden) {
        isNumericValueAxisActive = kpiObj.valueType !== constants.VALUE_TYPE.PERCENTAGE;
      }
    });
    this.state = {
      activeKPIs: props.initiallyActiveKPIs,
      chartData,
      hoveredKPI: null,
      redraw: false,
      chartOptions: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              id: 'numericValueAxis',
              position: 'left',
              ticks: {
                beginAtZero: false,
                display: isNumericValueAxisActive,
                labelOffset: 8,
                padding: -3.5,
                mirror: true,
                callback: (value, index, values) => (index === values.length - 1 ? '' : value),
                fontColor: '#888888',
              },
              gridLines: {
                offsetGridLines: false,
                drawBorder: false,
                zeroLineWidth: 1,
                lineWidth: 1,
                color: '#E0E0E0',
                zeroLineColor: '#E0E0E0',
              },
            },
            {
              id: 'percentageAxis',
              position: 'right',
              ticks: {
                beginAtZero: false,
                display: isPercentageAxisActive,
                labelOffset: 8,
                padding: -3.5,
                mirror: true,
                callback: (value, index, values) => (index === values.length - 1 ? ' b ' : value),
                fontColor: '#888888',
              },
              gridLines: {
                display: false,
                offsetGridLines: false,
                drawBorder: false,
                zeroLineWidth: 1,
                lineWidth: 1,
                color: '#E0E0E0',
                zeroLineColor: '#E0E0E0',
              },
            },
          ],
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: false,
              fontColor: '#888888',
            },
          }],
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  }

  toggleKPI(kpi) {
    const activeKPIs = this.state.activeKPIs.filter(it => it !== kpi);
    const chartData = this.state.chartData;

    const chartOptions = this.state.chartOptions;
    const previousDataSets = [...chartData.datasets].filter(it => !it.hidden);

    chartData.datasets.forEach(it => {
      const dataset = it;
      if (dataset.kpi === kpi) {
        dataset.hidden = !dataset.hidden;
      }
    });
    const nextDataSets = [...chartData.datasets].filter(it => !it.hidden);

    const { axisToRemove, axisToAdd } = this.axisToRemove(previousDataSets, nextDataSets);

    axisToRemove.forEach(axisName => {
      chartOptions.scales.yAxes.forEach(it => {
        const yAxis = it;
        if (yAxis.id === axisName) {
          yAxis.ticks.display = false;
        }
      });
    });
    axisToAdd.forEach(axisName => {
      chartOptions.scales.yAxes.forEach(it => {
        const yAxis = it;
        if (yAxis.id === axisName) {
          yAxis.ticks.display = true;
        }
      });
    });

    this.setState({
      activeKPIs: activeKPIs.length === this.state.activeKPIs.length ? [...activeKPIs, kpi] : activeKPIs,
      chartData,
      chartOptions,
      redraw: axisToRemove.length > 0 || axisToAdd.length > 0,
    });
  }

  toggleHovered(kpiKey) {
    this.setState({
      hoveredKPI: kpiKey,
      redraw: false,
    });
  }

  axisToRemove(previousDataSets, nextDataSets) {
    const previouslyActiveAxis = {};
    previousDataSets.forEach(dataSet => {
      const kpiKey = dataSet.kpi;
      const kpiObj = this.props.KPIValues[kpiKey];
      const activeAxis = kpiObj.valueType === constants.VALUE_TYPE.PERCENTAGE ?
        'percentageAxis' :
        'numericValueAxis';
      previouslyActiveAxis[activeAxis] = true;
    });
    const nextActiveAxis = {};
    nextDataSets.forEach(dataSet => {
      const kpiKey = dataSet.kpi;
      const kpiObj = this.props.KPIValues[kpiKey];
      const activeAxis = kpiObj.valueType === constants.VALUE_TYPE.PERCENTAGE ?
        'percentageAxis' :
        'numericValueAxis';
      nextActiveAxis[activeAxis] = true;
    });
    const axisToRemove = Object.keys(previouslyActiveAxis).filter(x => !(Object.keys(nextActiveAxis).indexOf(x) >= 0)) || [];
    const axisToAdd = Object.keys(nextActiveAxis).filter(x => !(Object.keys(previouslyActiveAxis).indexOf(x) >= 0)) || [];
    return { axisToRemove, axisToAdd };
  }

  render() {
    const { toggleKPI, toggleHovered } = this;
    const LineChart = ReactChartJS.Line;
    const chartData = this.state.chartData;
    const KPIValues = this.props.KPIValues;
    const activeKPIsMap = {};
    const hoveredKPI = this.state.hoveredKPI;
    this.state.activeKPIs.forEach(it => activeKPIsMap[it] = true); // eslint-disable-line no-return-assign

    return (
      <div >
        <div className={styles.KPIChartContainer}>
          <LineChart ref="lineChart" redraw={this.state.redraw} data={chartData} options={this.state.chartOptions} height="250" />
        </div>
        <div className={styles.KPIListContainer}>
          {Object.keys(KPIValues).map(kpiKey => {
            const kpi = KPIValues[kpiKey];
            return (
              <div onMouseEnter={() => toggleHovered(kpiKey)} onMouseLeave={() => toggleHovered(null)}>
                <KPIButton
                  key={kpiKey}
                  type={kpiKey}
                  name={kpi.label}
                  value={kpi.value}
                  color={kpi.color}
                  colorHovered={kpi.colorHovered}
                  valueType={kpi.valueType}
                  symbol="$"
                  selected={activeKPIsMap[kpiKey]}
                  hovered={hoveredKPI === kpiKey}
                  enabled={kpi.enabled}
                  percentage={kpi.change}
                  onClick={kpi.enabled ? () => toggleKPI(kpiKey) : null}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

}

KPIChart.propTypes = {
  chartData: PropTypes.object,
  KPIValues: PropTypes.object,
  initiallyActiveKPIs: PropTypes.array,
};

export default KPIChart;
