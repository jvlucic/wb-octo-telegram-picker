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
          <div className={styles.KPIListContainer}>
            {Object.keys(KPIValues).map(kpiKey => {
              const kpi = KPIValues[kpiKey];
              return (
                <KPIButton
                  key={kpiKey}
                  type={kpiKey}
                  name={kpi.label}
                  value={kpi.value}
                  symbol="$"
                  selected={activeKPIsMap[kpiKey]}
                  enabled={kpi.enabled}
                  percentage={kpi.change}
                  onClick={() => toggleKPI(kpiKey)}
                />
              );
            })}
          </div>
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
