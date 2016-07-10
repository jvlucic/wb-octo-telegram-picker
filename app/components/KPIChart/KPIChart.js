/**
 * Created by mongoose on 8/06/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactChartJS from 'react-chartjs';
import styles from './KPIChart.scss';
import KPIButton from 'components/KPIButton';
import { numberFormatter } from '../../utils/utils';
import { injectIntl } from 'react-intl';
import { formatNumericValue } from '../../intl/utils';
import constants from '../../constants';

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
    this.formatYValue = this.formatYValue.bind(this);
    const formatYValue = this.formatYValue;
    const { chartData, yAxes, xAxis } = this.processDataSets(props.chartData, this.props, props.activeKPIs);
    this.state = {
      chartData,
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
          position: 'bottom',
          display: false,
        },
        scales: {
          yAxes,
          xAxes: [xAxis],
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => (
              `${data.datasets[tooltipItem.datasetIndex].label}: ${formatYValue(data.datasets[tooltipItem.datasetIndex].kpi, tooltipItem.yLabel)}`
            ),
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chartData && nextProps.chartData !== this.props.chartData) {
      const { chartData, yAxes, xAxis } = this.processDataSets(nextProps.chartData, this.props, this.props.activeKPIs);
      this.setState({ chartData, yAxes, xAxis, redraw: true });
    }
  }

  getKPIFromKey(key) {
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
        return null;
    }
  }

  formatYValue(kpiKey, value) {
    const valueType = this.getKPIFromKey(kpiKey).valueType;
    return formatNumericValue(value, valueType, this.props.currency, this.props.intl);
  }

  processDataSets(originalChartData, props, activeKPIs) {
    const defaultDataSetConfig = {
      tension: 0,
    };
    const xAxis = {
      gridLines: {
        display: true,
        drawBorder: false,
        zeroLineWidth: 1,
        color: 'transparent',
        zeroLineColor: '#888888',
      },
      ticks: {
        beginAtZero: false,
        fontColor: '#888888',
      },
    };

    const chartData = { ...originalChartData };
    const yAxes = chartData.datasets.map(dataSet => {
      const kpiKey = dataSet.kpi;
      const kpi = props.KPIValues[kpiKey];
      /* Huge hack to avoid cutting off chart top */
      // const max = Math.max(...dataSet.data);
      // const nearest = Math.pow(10, max.toFixed(0).length - 1);
      // const roundedMax = Math.round(max / nearest) * nearest;
      // max: roundedMax * 1.25,
      return {
        id: kpiKey,
        position: 'left',
        display: false,
        ticks: {
          beginAtZero: true,
          callback: (value, index, values) => (index === values.length - 1 ? '' : numberFormatter(value)),
          fontColor: kpi.color,
          labelOffset: 0,
        },
        gridLines: {
          offsetGridLines: false,
          drawBorder: false,
          drawOnChartArea: true,
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
      dataSet.hidden = activeKPIs.indexOf(dataSet.kpi) < 0;
      if (!dataSet.hidden && !activatedFirstAxis) {
        yAxes[idx].display = true;
        xAxis.gridLines.zeroLineColor = kpi.color;
        dataSet.fill = true;
        activatedFirstAxis = true;
      }
      return dataSet;
    });

    return { chartData, yAxes, xAxis };
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
    const activeKPIs = this.props.activeKPIs.filter(it => it !== kpi);
    if (activeKPIs.length !== this.props.activeKPIs.length && this.props.activeKPIs.length <= 1) { // Always keep at least one KPI active
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
      activeKPIs: activeKPIs.length === this.props.activeKPIs.length ? [...activeKPIs, kpi] : activeKPIs,
      chartData,
      chartOptions,
      redraw: true,
    });
    this.props.onKPIToggle(kpi);
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
    this.props.activeKPIs.forEach(it => activeKPIsMap[it] = true); // eslint-disable-line no-return-assign
    /* TODO: HANDLE CURRENCY SYMBOLS IN A GENERIC WAY ?*/
    return (
      <div >
        <div className={styles.KPIChartContainer}>
          <LineChart
            ref="lineChart"
            redraw={this.state.redraw} data={chartData} options={this.state.chartOptions}
            onClick={handleChartClick} height={window && window.innerWidth >= 1280 ? 320 : 250}
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
                  symbol={this.props.currency === 'EUR' ? '€' : '$'}
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
  activeKPIs: PropTypes.array,
  intl: PropTypes.object,
  currency: PropTypes.string,
  onKPIToggle: PropTypes.func,
};

export default injectIntl(KPIChart);
