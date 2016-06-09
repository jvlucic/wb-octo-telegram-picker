/**
 * Created by mongoose on 8/06/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactChartJS from 'react-chartjs';
import styles from './KPIChart.scss';

const randomColorFactor = () => Math.round(Math.random() * 255);

const randomColor = (opacity) => `rgba(${randomColorFactor()} , ${randomColorFactor()} , ${randomColorFactor()} , ${opacity || '.3'} )`;

class KPIChart extends Component {
  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/
  constructor(props) {
    super(props);
    this.randomizeData = this.randomizeData.bind(this);
    this.addDataSet = this.addDataSet.bind(this);
    const initialChartData = this.props.chartData;
    /* TODO: remove KPI prop ?? */
    initialChartData.datasets = initialChartData.datasets.filter(it => this.props.initiallyActiveKPIs.indexOf(it.kpi) >= 0);
    this.state = {
      activeKPIs: this.props.initiallyActiveKPIs,
      chartData: initialChartData,
      KPIValues: this.props.KPIValues,
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

  randomizeData() {
    const randomArr = this.state.chartData.datasets[0].data.map(() => Math.random() * 255);
    const chartData = { ...this.state.chartData };
    chartData.datasets[0].data = randomArr;
    this.setState({ chartData });
  }


  addDataSet() {
    const randomArr = this.state.chartData.datasets[0].data.map(() => Math.random() * 255);
    const chartData = { ...this.state.chartData };
    const dataset = {
      label: `My ${this.state.chartData.datasets.length}  DataSet`,
      borderColor: randomColor(0.4),
      backgroundColor: 'transparent',
      pointBorderColor: randomColor(0.7),
      pointBackgroundColor: randomColor(0.5),
      pointBorderWidth: 1,
      data: randomArr,
    };
    chartData.datasets.push(dataset);
    this.setState({ chartData });
  }


  render() {
    const LineChart = ReactChartJS.Line;
    const { randomizeData, addDataSet } = this;
    return (
      <div >
        <div className={styles.KPIChartContainer}>
          <LineChart data={this.state.chartData} options={this.state.chartOptions} width="1226" height="250" />
        </div>
        <div className={styles.KPIListContainer}>
          {Object.keys(this.props.KPIValues).map(kpiKey => {
            const kpi = this.props.KPIValues[kpiKey];
            return (<div className={styles.KPIElem}>
              <div>{kpi.label}</div>
              <div>{kpi.value}</div>
            </div>);
          })}
        </div>
        <div className={styles.dummyControls}>
          <button onClick={randomizeData}> RandomizeChartData</button>
          <button onClick={addDataSet}> addRandomDataSet</button>
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
