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
    const chartData = { ...this.props.chartData };
    chartData.datasets = chartData.datasets.filter(it => this.props.initiallyActiveKPIs.indexOf(it.kpi) >= 0);
    this.state = {
      activeKPIs: this.props.initiallyActiveKPIs,
      chartData,
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        responsive: false,
        maintainAspectRatio: true,
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

  render() {
    const { toggleKPI } = this;
    const LineChart = ReactChartJS.Line;
    const chartData = this.state.chartData;
    const KPIValues = this.props.KPIValues;
    const activeKPIsMap = {};
    this.state.activeKPIs.forEach(it => activeKPIsMap[it] = true); // eslint-disable-line no-return-assign
    return (
      <div >
        <div className={styles.KPIChartContainer}>
          <LineChart data={chartData} options={this.state.chartOptions} width="1226" height="250" />
        </div>
        <div className={styles.KPIListContainer}>
          {Object.keys(KPIValues).map(kpiKey => {
            const kpi = KPIValues[kpiKey];
            // TODO: Do a better way to get the type
            const type = ['impressions', 'clicks', 'ctr', 'conversion', 'cvr']
              .reduce((curentType, specialType) => {
                if (specialType === kpi.label.toLowerCase()) {
                  return specialType;
                }
                return curentType;
              }, 'normal');
            return (
              <KPIButton
                key={kpiKey}
                name={kpi.label}
                type={type}
                value={kpi.value}
                symbol="$"
                active={!!activeKPIsMap[kpiKey]}
                percentage={Math.floor(Math.random() * 7) - 3}
                onClick={() => toggleKPI(kpiKey)}
              />
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
