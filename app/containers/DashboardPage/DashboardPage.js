/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */
/* eslint-disable */
import React from 'react';
import { KPIChart, CampaignTable } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { actions } from './reducer';
import { KPIDataSelector, campaignTableHeadersSelector, campaignTableListSelector } from './selectors';
import styles from './DashboardPage.scss';
import { fromJS } from 'immutable';

const list = fromJS([
  { name: 'Brian Vaughn6', description: 'Software engineer' },
  { name: 'Brian Vaughn8', description: 'Software engineer' },
  { name: 'Brian Vaughn1', description: 'Software engineer' },
  { name: 'Brian Vaughn2', description: 'Software engineer' },
  { name: 'Brian Vaughn3', description: 'Software engineer' },
  { name: 'Brian Vaughn4', description: 'Software engineer' },
]);

class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    if (!this.props.KPIData) {
      this.props.getCampaignData();
    }
  }

  render() {
    const {KPIData, tableHeaders, tableList} = this.props;
    return (
      <div>
        <div className={styles.KPIChartContainer}>
          { KPIData && <KPIChart KPIValues={ KPIData.KPIValues } chartData={ KPIData.chartData } initiallyActiveKPIs = { KPIData.activeKPIs }  /> }
        </div>
        <div className={styles.campaignTableContainer}>
          { tableList && <CampaignTable list={tableList} headers={tableHeaders} /> }
        </div>
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    KPIData: KPIDataSelector,
    tableHeaders: campaignTableHeadersSelector,
    tableList: campaignTableListSelector,
  }),
  dispatch => {
    return bindActionCreators(actions, dispatch);
  }
)(DashboardPage);

DashboardPage.propTypes = {
  KPIData: React.PropTypes.object,
  getCampaignData: React.PropTypes.func.isRequired,
};
