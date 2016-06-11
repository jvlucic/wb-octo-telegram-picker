/**
 * Created by mongoose on 8/06/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactChartJS from 'react-chartjs';
import styles from './KPIChart.scss';
import KPIButton from 'components/KPIButton';

class KPIChart extends Component {
  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/
  constructor(props) {
    super(props);
    this.toggleKPI = this.toggleKPI.bind(this);
    this.toggleHovered = this.toggleHovered.bind(this);
    const chartData = { ...this.props.chartData };
    chartData.datasets = chartData.datasets.filter(it => this.props.initiallyActiveKPIs.indexOf(it.kpi) >= 0);
    this.state = {
      activeKPIs: this.props.initiallyActiveKPIs,
      chartData,
      hoveredKPI: null,
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              display: true,
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
          }],
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
    if (activeKPIs.length === this.state.activeKPIs.length) {
      const dataSet = this.props.chartData.datasets.filter(it => it.kpi === kpi);
      chartData.datasets.push(dataSet[0]);
    } else {
      const index = chartData.datasets.findIndex(it => it.kpi === kpi);
      chartData.datasets.splice(index, 1);
    }
    this.setState({
      activeKPIs: activeKPIs.length === this.state.activeKPIs.length ? [...activeKPIs, kpi] : activeKPIs,
      chartData,
    });
  }

  toggleHovered(kpiKey) {
    this.setState({
      hoveredKPI: kpiKey,
    });
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
          <LineChart data={chartData} options={this.state.chartOptions} height="250" />
        </div>
        <div className={styles.KPIListContainer}>
          {Object.keys(KPIValues).map(kpiKey => {
            const kpi = KPIValues[kpiKey];
            return (
              <div onMouseEnter={() => toggleHovered(kpiKey)} onMouseLeave={() => toggleHovered(null)} >
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
                  onClick={() => toggleKPI(kpiKey)}
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
