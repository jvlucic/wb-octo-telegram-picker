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
         activeKPIsSelector, loadingSelector, toggledCampaignSelector } from './selectors';
import styles from './DashboardPage.scss';

class DashboardPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  /**
   * constructor
   */
  constructor(props) {
    super(props);

    // Binding methods to this
    this.handleOnChangeCampaignStatus = this.handleOnChangeCampaignStatus.bind(this);
    this.handleOnChangeDateRangeFilter = this.handleOnChangeDateRangeFilter.bind(this);
    this.handleOnChangeCampaignStatusFilter = this.handleOnChangeCampaignStatusFilter.bind(this);
    this.handleOnChangeSelectedCampaignFilter = this.handleOnChangeSelectedCampaignFilter.bind(this);
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
  handleOnChangeDateRangeFilter({ to, from }) {
    this.props.changeDateRange({ to, from });
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
      <div>
        <div className={styles.statusFilter}>
          <span className={styles.title} >Showing data across</span>
          <div className={styles.dropDownContainer}>
            <CampaignFilterDropdown selectedCampaign={selectedCampaign} initialValue={status} onChange={this.handleOnChangeCampaignStatusFilter} />
          </div>
          <div className={styles.calendarContainer}>
            <Calendar active from={range.from} to={range.to} onChange={this.handleOnChangeDateRangeFilter} />
          </div>
        </div>
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
             toggledCampaign={toggledCampaign}
             selectedCampaign={selectedCampaign} />
        </div> }
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
  }),
  dispatch => {
    return bindActionCreators({ ...actions }, dispatch);
  }
)(DashboardPage);

DashboardPage.propTypes = {
  KPIData: React.PropTypes.object,
  getCampaignData: React.PropTypes.func.isRequired,
  changeDateRange: React.PropTypes.func.isRequired,
  changeCampaignStatus: React.PropTypes.func.isRequired,
  changeCampaignStatusFilter: React.PropTypes.func.isRequired,
  changeSelectedCampaignFilter: React.PropTypes.func.isRequired,
};
