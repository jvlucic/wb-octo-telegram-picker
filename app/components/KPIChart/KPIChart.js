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

    const chartData = { ...props.chartData };
    const defaultDataSetConfig = {
      tension: 0.1,
    };
    const xAxis = {
      gridLines: {
        display: true,
        drawBorder: false,
        zeroLineWidth: 1,
        color: 'transparent',
        zeroLineColor: 'green',
      },
      ticks: {
        beginAtZero: false,
        fontColor: '#888888',
      },
    };

    const yAxes = chartData.datasets.map(dataSet => {
      const kpiKey = dataSet.kpi;
      const kpi = props.KPIValues[kpiKey];
      return {
        id: kpiKey,
        position: 'left',
        display: false,
        ticks: {
          beginAtZero: true,
          callback: (value, index, values) => (index === values.length - 1 ? '' : value),
          fontColor: kpi.color,
          labelOffset: 0,
        },
        gridLines: {
          offsetGridLines: true,
          drawBorder: false,
          zeroLineWidth: 1,
          lineWidth: 1,
          color: kpi.color,
          zeroLineColor: kpi.color,
        },
      };
    });
    let activatedFirstAxis = false;
    chartData.datasets = chartData.datasets.map((it, idx) => {
      const dataSet = { ...defaultDataSetConfig, ...it };
      const kpiKey = dataSet.kpi;
      const kpi = props.KPIValues[kpiKey];
      dataSet.yAxisID = kpiKey;
      dataSet.hidden = props.initiallyActiveKPIs.indexOf(dataSet.kpi) < 0;
      if (!dataSet.hidden && !activatedFirstAxis) {
        yAxes[idx].display = true;
        xAxis.gridLines.zeroLineColor = kpi.color;
        activatedFirstAxis = true;
      }
      return dataSet;
    });

    this.state = {
      chartData,
      activeKPIs: props.initiallyActiveKPIs,
      hoveredKPI: null,
      redraw: false,
      chartOptions: {
        legend: {
          display: false,
        },
        scales: {
          yAxes,
          xAxes: [xAxis],
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
    // const previousDataSets = [...chartData.datasets].filter(it => !it.hidden);
    let toggledDatasetWillBeShown = false;
    chartData.datasets.forEach(it => {
      const dataset = it;
      if (dataset.kpi === kpi) {
        dataset.hidden = !dataset.hidden;
        toggledDatasetWillBeShown = !dataset.hidden;
      }
    });
    const props = this.props;

    // const nextDataSets = [...chartData.datasets].filter(it => !it.hidden);
    if (toggledDatasetWillBeShown) {
      chartOptions.scales.yAxes.forEach((it) => {
        const yAxis = it;
        if (yAxis.id === kpi) {
          const kpiObj = props.KPIValues[kpi];
          yAxis.display = true;
          chartOptions.scales.xAxes[0].gridLines.zeroLineColor = kpiObj.color;
        } else {
          yAxis.display = false;
        }
      });
    } else {
      let activatedOneScale = false;
      for (let idx = 0; idx < chartOptions.scales.yAxes.length; idx++) {
        const yAxis = chartOptions.scales.yAxes[idx];
        const dataset = chartData.datasets[idx];
        if (!dataset.hidden) {
          if (!activatedOneScale) {
            const kpiObj = props.KPIValues[dataset.kpi];
            yAxis.display = true;
            chartOptions.scales.xAxes[0].gridLines.zeroLineColor = kpiObj.color;
            activatedOneScale = true;
          }
        } else {
          yAxis.display = false;
        }
      }
    }
    /*
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
  */
    this.setState({
      activeKPIs: activeKPIs.length === this.state.activeKPIs.length ? [...activeKPIs, kpi] : activeKPIs,
      chartData,
      chartOptions,
      redraw: true,
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
