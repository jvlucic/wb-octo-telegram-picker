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
import { KPIChart, CampaignTable, Calendar } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { actions } from './reducer';
import { KPIDataSelector, selectRange, campaignTableHeadersSelector, campaignTableListSelector } from './selectors';
import { changeDateRange } from './actions';
import styles from './DashboardPage.scss';

class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  /**
   * constructor
   */
  constructor(props) {
    super(props);

    // Binding methods to this
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.KPIData) {
      this.props.getCampaignData();
    }
  }

  /**
   * Handle date picker changes
   * @param  {Object} range     - Range given for the input date
   * @param  {Date} range.to    - Higher date in the range
   * @param  {Date} range.from  - Lower date in the range
   */
  handleOnChange({ to, from }) {
    this.props.changeDateRange({ to, from });
  }

  render() {
    const {KPIData, range, tableHeaders, tableList} = this.props;
    return (
      <div>
        <Calendar active from={range.from} to={range.to} onChange={this.handleOnChange} />
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
    range: selectRange,
  }),
  dispatch => {
    return bindActionCreators({ ...actions, changeDateRange }, dispatch);
  }
)(DashboardPage);

DashboardPage.propTypes = {
  KPIData: React.PropTypes.object,
  getCampaignData: React.PropTypes.func.isRequired,
};
