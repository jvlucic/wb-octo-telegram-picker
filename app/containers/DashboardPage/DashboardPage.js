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
import { DownloadIcon} from '../../theme/assets';
import { injectIntl } from 'react-intl';
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
    this.handleKPIToggle = this.handleKPIToggle.bind(this);
    this.handleCSVDownload = this.handleCSVDownload.bind(this);
    this.handleOnChangeCampaignStatus = this.handleOnChangeCampaignStatus.bind(this);
    this.handleOnChangeDateRangeFilter = this.handleOnChangeDateRangeFilter.bind(this);
    this.handleOnChangeCampaignStatusFilter = this.handleOnChangeCampaignStatusFilter.bind(this);
    this.handleOnChangeSelectedCampaignFilter = this.handleOnChangeSelectedCampaignFilter.bind(this);
    this.handleOnResetDateRange = this.handleOnResetDateRange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.previousScrollY = 0;
  }

  componentDidMount() {
    if (!this.props.KPIData) {
      this.props.getCampaignData();
    }
    /* TODO: DO NOT HARDCODE ID, PASS COMPONENT THROUGH PROPS ! */
    appContainer = document.getElementById('appComponentContainer');
    window.addEventListener('scroll', ::this.handleScroll);
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
    let scrollingDown = false;
    if ( this.previousScrollY < window.scrollY){
      scrollingDown = true;
    }
    if (window.scrollY <= 52) {
      if (appContainer && appContainer.className.indexOf('noHeader') >= 0 ) {
        appContainer.className = appContainer.className.replace(/\bnoHeader\b/, '');
      }
    } else {
      if (appContainer && appContainer.className.indexOf('noHeader') === -1) {
        appContainer.className += ' noHeader';
      }
    }
    const campaignTableHeaderPosition = window && window.innerWidth >= 1280 ? 541 : 471;
    if (window.scrollY < campaignTableHeaderPosition) {
      if (appContainer && appContainer.className.indexOf('sticky') >= 0) {
        appContainer.className = appContainer.className.replace(/\bsticky\b/, '');
      }
    } else {
      if (appContainer && appContainer.className.indexOf('sticky') === -1) {
        appContainer.className += ' sticky';
      }
    }
    this.previousScrollY = window.scrollY;
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
  handleKPIToggle(kpi){
    this.props.toggleKPI(kpi);
  }
  handleCSVDownload(){
    const headers = this.props.tableHeaders;
    const list =  Object.values(this.props.tableList).map( dataObj => {
      return headers.map( header => {
        if (header === constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN){
          return dataObj[header].name;
        }
        if (header === constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS){
          return dataObj[header] ? 'active' : 'inactive';
        }
        return dataObj[header];
      })
    });
    const data =  [headers, ...list];
    let dataString = '';
    let csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
      dataString = infoArray.join(',');
      csvContent += index < data.length ? dataString+ '\n' : dataString;
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campaign_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  render() {
    const {KPIData, range, tableHeaders, tableList, status, selectedCampaign, activeKPIs, loading, toggledCampaign} = this.props;
    return (
      <div className={styles.dashboardPage} >
        <div ref="filterBar" className={styles.statusFilter}>
          <span className={styles.title} >Showing data across</span>
          <div className={styles.dropDownContainer}>
            <CampaignFilterDropdown selectedCampaign={selectedCampaign} initialValue={status} onChange={this.handleOnChangeCampaignStatusFilter} />
          </div>
          <div className={styles.downloadToolsContainer}>
            <div><DownloadIcon/></div>
            <div>PDF</div>
            <div onClick={this.handleCSVDownload}>Excel</div>
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
            <KPIChart KPIValues={ KPIData.KPIValues }
                      chartData={ KPIData.chartData }
                      currency={KPIData.currency}
                      activeKPIs = { activeKPIs }
                      onKPIToggle={ this.handleKPIToggle } />
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

export default injectIntl(connect(
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
)(DashboardPage));

DashboardPage.propTypes = {
  KPIData: React.PropTypes.object,
  addAlert: React.PropTypes.func.isRequired,
  getCampaignData: React.PropTypes.func.isRequired,
  changeDateRange: React.PropTypes.func.isRequired,
  changeCampaignStatus: React.PropTypes.func.isRequired,
  changeCampaignStatusFilter: React.PropTypes.func.isRequired,
  changeSelectedCampaignFilter: React.PropTypes.func.isRequired,
};
