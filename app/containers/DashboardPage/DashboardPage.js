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
import { KPIChart, CampaignTable, Calendar, CampaignFilterDropdown, Loader } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { actions } from './reducer';
import { KPIDataSelector, selectRange, campaignTableHeadersSelector,
         campaignTableListSelector, campaignStatusSelector, selectedCampaignSelector,
         activeKPIsSelector, loadingSelector, toggledCampaignSelector, errorSelector } from './selectors';
import classnames from 'classnames';
import constants from '../../constants';
import styles from './DashboardPage.scss';
let appContainer = null;
class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  /**
   * constructor
   */
  constructor(props) {
    super(props);

    // Binding methods to this
    this.handleOnAddAlert = this.handleOnAddAlert.bind(this);
    this.handleOnChangeCampaignStatus = this.handleOnChangeCampaignStatus.bind(this);
    this.handleOnChangeDateRangeFilter = this.handleOnChangeDateRangeFilter.bind(this);
    this.handleOnChangeCampaignStatusFilter = this.handleOnChangeCampaignStatusFilter.bind(this);
    this.handleOnChangeSelectedCampaignFilter = this.handleOnChangeSelectedCampaignFilter.bind(this);
    this.handleOnResetDateRange = this.handleOnResetDateRange.bind(this);
  }

  componentDidMount() {
    if (!this.props.KPIData) {
      this.props.getCampaignData();
    }
    /* TODO: DO NOT HARDCODE ID, PASS COMPONENT THROUGH PROPS ! */
    appContainer = document.getElementById('appComponentContainer');
    window.addEventListener('scroll', ::this.handleScroll);
    if (appContainer && appContainer.className.indexOf('sticky') === -1) {
      appContainer.className += ' sticky';
    }
    if (appContainer && appContainer.className.indexOf('dashboardPage') === -1) {
      appContainer.className += ' dashboardPage';
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', ::this.handleScroll);
    if (appContainer && appContainer.className.indexOf('sticky') >= 0) {
      appContainer.className = appContainer.className.replace(/\bsticky\b/, '');
    }
    if (appContainer && appContainer.className.indexOf('dashboardPage') >= 0) {
      appContainer.className = appContainer.className.replace(/\bdashboardPage\b/, '');
    }
  }

  handleScroll() {
    /* TODO: do not hardcode the scroll position , this is only useful for dashboard page! */
    if (window.scrollY >= 424) {
      if (appContainer && appContainer.className.indexOf('sticky') >= 0) {
        appContainer.className = appContainer.className.replace(/\bsticky\b/, '');
      }
    } else {
      if (appContainer && appContainer.className.indexOf('sticky') === -1) {
        appContainer.className += ' sticky';
      }
    }
  }


  componentWillReceiveProps(nextProps) {
    const error = nextProps.error;
    /* TODO: Handle error type */
    if (error) {
      switch (error.message) {
        case (constants.ERROR_TYPE.SERVER_ERROR): {
          this.handleOnAddAlert('error', 'An unexpected error has occurred', null);
          return;
        }
        default:
          return;
      }
    }
  }

  handleOnAddAlert(type, message, title) {
    this.props.addAlert(type, message, title);
  }
  /**
   * Handle date picker changes
   * @param  {Object} range     - Range given for the input date
   * @param  {Date} range.to    - Higher date in the range
   * @param  {Date} range.from  - Lower date in the range
   */
  handleOnChangeDateRangeFilter({ to, from }) {
    this.props.changeDateRange({ to, from });
  }

  /**
   * Reset the date range to default
   */
  handleOnResetDateRange() {
    this.props.resetDateRange();
  }

  handleOnChangeCampaignStatusFilter(status) {
    this.props.changeCampaignStatusFilter(status);
  }

  handleOnChangeSelectedCampaignFilter(status) {
    this.props.changeSelectedCampaignFilter(status);
  }
  handleOnChangeCampaignStatus(id, status) {
    this.props.changeCampaignStatus(id, status);
  }

  render() {
    const {KPIData, range, tableHeaders, tableList, status, selectedCampaign, activeKPIs, loading, toggledCampaign} = this.props;
    return (
      <div className={styles.dashboardPage} >
        <div className={styles.statusFilter}>
          <span className={styles.title} >Showing data across</span>
          <div className={styles.dropDownContainer}>
            <CampaignFilterDropdown selectedCampaign={selectedCampaign} initialValue={status} onChange={this.handleOnChangeCampaignStatusFilter} />
          </div>
          <div className={styles.calendarContainer}>
            <Calendar
              active
              from={range.from}
              to={range.to}
              onChange={this.handleOnChangeDateRangeFilter}
              onClean={this.handleOnResetDateRange}
            />
          </div>
        </div>
        <div className={styles.innerContainer}>
          {loading && <div><Loader/></div>}
          { !loading && KPIData &&  <div className={styles.KPIChartContainer}>
            <KPIChart KPIValues={ KPIData.KPIValues } chartData={ KPIData.chartData } initiallyActiveKPIs = { activeKPIs }  />
          </div>}
          { !loading && tableList && <div className={styles.campaignTableContainer}>
             <CampaignTable
               list={tableList}
               headers={tableHeaders}
               onRowSelect={this.handleOnChangeSelectedCampaignFilter}
               onToggleSwitchClick={this.handleOnChangeCampaignStatus}
               onAddAlert={this.handleOnAddAlert}
               toggledCampaign={toggledCampaign}
               selectedCampaign={selectedCampaign} />
          </div> }
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
    status: campaignStatusSelector,
    selectedCampaign: selectedCampaignSelector,
    activeKPIs: activeKPIsSelector,
    loading: loadingSelector,
    toggledCampaign: toggledCampaignSelector,
    error: errorSelector,
  }),
  dispatch => {
    return bindActionCreators({ ...actions }, dispatch);
  }
)(DashboardPage);

DashboardPage.propTypes = {
  KPIData: React.PropTypes.object,
  addAlert: React.PropTypes.func.isRequired,
  getCampaignData: React.PropTypes.func.isRequired,
  changeDateRange: React.PropTypes.func.isRequired,
  changeCampaignStatus: React.PropTypes.func.isRequired,
  changeCampaignStatusFilter: React.PropTypes.func.isRequired,
  changeSelectedCampaignFilter: React.PropTypes.func.isRequired,
};
