/**
 * Created by mongoose on 8/06/16.
 */

import React, { PropTypes, Component } from 'react';
import ReactChartJS from 'react-chartjs';
import styles from './KPIChart.scss';

const randomColorFactor = () => Math.round(Math.random() * 255);

const randomColor = (opacity) => `rgba(${randomColorFactor()} , ${randomColorFactor()} , ${randomColorFactor()} , ${opacity || '.3'} )`;

class KPIChart extends Component {

  constructor(props) {
    super(props);
    this.randomizeData = this.randomizeData.bind(this);
    this.addDataSet = this.addDataSet.bind(this);
    this.state = {
      chartData: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Impressions',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'transparent',
          borderWidth: 1,
        }],
      },
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
    const randomArr = this.state.chartData.datasets[0].data.map(() => Math.random() * 20);
    const chartData = { ...this.state.chartData };
    chartData.datasets[0].data = randomArr;
    this.setState({ chartData });
  }


  addDataSet() {
    const randomArr = this.state.chartData.datasets[0].data.map(() => Math.random() * 20);
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
      <div className={styles.KPIChartContainer}>
        <div >
          <LineChart data={this.state.chartData} options={this.state.chartOptions} width="1226" height="250" />
        </div>
        <div>
          <button onClick={randomizeData}> RandomizeChartData</button>
          <button onClick={addDataSet}> addRandomDataSet</button>
        </div>
      </div>
    );
  }

}

KPIChart.propTypes = {
  data: PropTypes.array,
};

export default KPIChart;
