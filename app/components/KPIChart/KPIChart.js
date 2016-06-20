/**
 * Created by mongoose on 8/06/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactChartJS from 'react-chartjs';
import styles from './KPIChart.scss';
import KPIButton from 'components/KPIButton';

function setColorAlpha(color, alpha) {
  const parts = color.split(',');
  if (parts.length <= 0) { // NOT RGBA FORMAT
    return color;
  }
  parts[3] = `${alpha})`;
  return parts.join(',');
}

const GRID_LINES_ALPHA = 0.2;

class KPIChart extends Component {
  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/

  constructor(props) {
    super(props);
    this.toggleKPI = this.toggleKPI.bind(this);
    this.toggleHovered = this.toggleHovered.bind(this);
    this.handleChartClick = this.handleChartClick.bind(this);
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
          color: setColorAlpha(kpi.color, GRID_LINES_ALPHA),
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
        dataSet.fill = true;
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
        hover: {
          mode: 'dataset',
          onHover: (elms) => (elms && elms.length > 0 ?  // eslint-disable-line no-return-assign
              this.refs.lineChart.getCanvas().style.cursor = 'pointer' :
              this.refs.lineChart.getCanvas().style.cursor = ''
          ),
        },
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
  redrawChart(kpi, props, toggledDatasetWillBeShown, origChartOptions, origChartData) {
    const chartOptions = origChartOptions;
    const chartData = origChartData;
    if (toggledDatasetWillBeShown) {
      chartOptions.scales.yAxes.forEach((it, idx) => {
        const yAxis = it;
        if (yAxis.id === kpi) {
          const kpiObj = props.KPIValues[kpi];
          yAxis.display = true;
          chartOptions.scales.xAxes[0].gridLines.zeroLineColor = kpiObj.color;
          chartData.datasets[idx].fill = true;
        } else {
          yAxis.display = false;
          chartData.datasets[idx].fill = false;
        }
      });
    } else {
      let activatedOneScale = chartOptions.scales.yAxes
        .map(it => it.id === kpi ? false : it.display) // eslint-disable-line no-confusing-arrow
        .reduce((a, b) => a || b);
      for (let idx = 0; idx < chartOptions.scales.yAxes.length; idx++) {
        const yAxis = chartOptions.scales.yAxes[idx];
        const dataset = chartData.datasets[idx];
        if (!dataset.hidden) {
          if (!activatedOneScale) {
            const kpiObj = props.KPIValues[dataset.kpi];
            yAxis.display = true;
            dataset.fill = true;
            chartOptions.scales.xAxes[0].gridLines.zeroLineColor = kpiObj.color;
            activatedOneScale = true;
          }
        }
        if (dataset.hidden) {
          yAxis.display = false;
          dataset.fill = false;
        }
      }
    }
    return { chartOptions, chartData };
  }

  toggleKPI(kpi) {
    const activeKPIs = this.state.activeKPIs.filter(it => it !== kpi);
    if (activeKPIs.length !== this.state.activeKPIs.length && this.state.activeKPIs.length <= 1) { // Always keep at least one KPI active
      return;
    }

    const origChartData = this.state.chartData;

    const origChartOptions = this.state.chartOptions;
    let toggledDatasetWillBeShown = false;
    origChartData.datasets.forEach(it => {
      const dataset = it;
      if (dataset.kpi === kpi) {
        dataset.hidden = !dataset.hidden;
        toggledDatasetWillBeShown = !dataset.hidden;
      }
    });
    const props = this.props;
    const { chartOptions, chartData } = this.redrawChart(kpi, props, toggledDatasetWillBeShown, origChartOptions, origChartData);
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

  handleChartClick(event) {
    const elementsClicked = this.refs.lineChart.getChart().getElementAtEvent(event);
    if (elementsClicked.length <= 0) {
      return;
    }
    const elementClicked = elementsClicked[0];
    const kpi = this.refs.lineChart.getChart().data.datasets[elementClicked._datasetIndex].kpi; // eslint-disable-line no-underscore-dangle
    const { chartOptions, chartData } = this.redrawChart(kpi, this.props, true, this.state.chartOptions, this.state.chartData);
    this.setState({
      chartData,
      chartOptions,
      redraw: true,
    });
  }

  render() {
    const { toggleKPI, toggleHovered, handleChartClick } = this;
    const LineChart = ReactChartJS.Line;
    const chartData = this.state.chartData;
    const KPIValues = this.props.KPIValues;
    const activeKPIsMap = {};
    const hoveredKPI = this.state.hoveredKPI;
    this.state.activeKPIs.forEach(it => activeKPIsMap[it] = true); // eslint-disable-line no-return-assign

    return (
      <div >
        <div className={styles.KPIChartContainer}>
          <LineChart
            ref="lineChart"
            redraw={this.state.redraw} data={chartData} options={this.state.chartOptions}
            onClick={handleChartClick} height="250"
          />
        </div>
        <div className={styles.KPIListContainer}>
          {Object.keys(KPIValues).map(kpiKey => {
            const kpi = KPIValues[kpiKey];
            return (
              <div key={kpiKey} onMouseEnter={() => toggleHovered(kpiKey)} onMouseLeave={() => toggleHovered(null)}>
                <KPIButton
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
