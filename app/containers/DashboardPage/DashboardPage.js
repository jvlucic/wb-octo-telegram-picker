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
import { KPIChart } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { actions } from './reducer';
import { KPIDataSelector } from './selectors';
class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    if (!this.props.KPIData) {
      this.props.getCampaignData();
    }
  }

  render() {
    const {KPIData} = this.props;
    return (
      <div>
        { KPIData && <KPIChart KPIValues={ KPIData.KPIValues } chartData={ KPIData.chartData } initiallyActiveKPIs = { KPIData.activeKPIs }  /> }
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    KPIData: KPIDataSelector,
  }),
  dispatch => {
    return bindActionCreators(actions, dispatch);
  }
)(DashboardPage);

DashboardPage.propTypes = {
  KPIData: React.PropTypes.object,
  getCampaignData: React.PropTypes.func.isRequired,
};
