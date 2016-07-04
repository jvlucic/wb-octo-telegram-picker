/**
 * Created by mongoose on 8/06/16.
 */
import React, { PropTypes, Component } from 'react';
import { FlexTable, FlexColumn, AutoSizer, SortIndicator, SortDirection } from 'react-virtualized';
import shallowCompare from 'react-addons-shallow-compare';
import constants from '../../constants';
import classnames from 'classnames';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { CampaignAmountIcon, CampaignTimeIcon } from '../../theme/assets';
import { formatDate } from '../../utils/utils';
import 'react-virtualized/styles.css'; // only needs to be imported once
import styles from './CampaignTable.scss';
import { formatNumericValue } from '../../intl/utils';
import { injectIntl } from 'react-intl';

class CampaignTable extends Component {

  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/
  constructor(props, context) {
    super(props, context);
    const rowCount = Object.keys(props.list).length;
    this.state = {
      headerHeight: 50,
      height: (Math.min(rowCount, 50) + 1) * 70,
      overscanRowCount: 10,
      rowHeight: 70,
      rowCount: Math.min(rowCount, 50),
      scrollToIndex: undefined,
      sortBy: constants.KPI.IMPRESSIONS.key,
      sortDirection: SortDirection.DESC,
      selectedRow: false,
    };
    this.currentList = [];
    this.headerRenderer = this.headerRenderer.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.noRowsRenderer = this.noRowsRenderer.bind(this);
    this.getRowHeight = this.getRowHeight.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.formatValue = this.formatValue.bind(this);
    this.handleToggleSwitchClick = this.handleToggleSwitchClick.bind(this);
    this.sort = this.sort.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const toggledCampaign = nextProps.toggledCampaign;
    /* TODO: Translate Toast Message */
    if (toggledCampaign) {
      const previousCampaignChangedStatus = this.props.list[toggledCampaign].campaign.changed;
      const nextCampaignChangedStatus = nextProps.list[toggledCampaign] && nextProps.list[toggledCampaign].campaign.changed || 'success';
      if (previousCampaignChangedStatus === 'loading' && nextCampaignChangedStatus && nextCampaignChangedStatus !== 'loading') {
        if (nextCampaignChangedStatus === 'error') {
          this.props.onAddAlert('error', `Campaign ${toggledCampaign} update failed`, null);
        } else if (nextCampaignChangedStatus === 'success') {
          this.props.onAddAlert('success', `Campaign ${toggledCampaign} successfully updated`, null);
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  getHeaderLabel(header) {
    switch (header) {
      case constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS:
        return constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS;
      case constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN:
        return constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN;
      case constants.KPI.IMPRESSIONS.key:
        return constants.KPI.IMPRESSIONS.name;
      case constants.KPI.CLICKS.key:
        return constants.KPI.CLICKS.name;
      case constants.KPI.CTR.key:
        return constants.KPI.CTR.name;
      case constants.KPI.CONVERSION.key:
        return constants.KPI.CONVERSION.name;
      case constants.KPI.CVR.key:
        return constants.KPI.CVR.name;
      case constants.KPI.CPM.key:
        return constants.KPI.CPM.name;
      case constants.KPI.CPC.key:
        return constants.KPI.CPC.name;
      case constants.KPI.CPO.key:
        return constants.KPI.CPO.name;
      case constants.KPI.COST.key:
        return constants.KPI.COST.name;
      case constants.KPI.ORDER_VALUE.key:
        return constants.KPI.ORDER_VALUE.name;
      case constants.KPI.MARGIN.key:
        return constants.KPI.MARGIN.name;
      case constants.KPI.ROI.key:
        return constants.KPI.ROI.name;
      default:
        return '';
    }
  }

  getColumnWidth(header) {
    const relativeWidth = 30;
    switch (header) {
      case constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS:
        return 45;
      case constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN:
        return 300;
      case constants.KPI.IMPRESSIONS.key:
        return 76;
      case constants.KPI.CLICKS.key:
        return 40;
      case constants.KPI.CTR.key:
        return relativeWidth;
      case constants.KPI.CONVERSION.key:
        return 83;
      case constants.KPI.CVR.key:
        return relativeWidth;
      case constants.KPI.CPM.key:
        return relativeWidth;
      case constants.KPI.CPC.key:
        return relativeWidth;
      case constants.KPI.CPO.key:
        return relativeWidth;
      case constants.KPI.COST.key:
        return 45;
      case constants.KPI.ORDER_VALUE.key:
        return 72;
      case constants.KPI.MARGIN.key:
        return 42;
      case constants.KPI.ROI.key:
        return 35;
      default:
        return 60;
    }
  }

  getDatum(list, index) {
    return list[index % list.length];
  }

  getRowHeight() {
    return this.state.rowHeight;
  }

  getKPIFromKey(key) {
    switch (key) {
      case constants.KPI.IMPRESSIONS.key:
        return constants.KPI.IMPRESSIONS;
      case constants.KPI.CLICKS.key:
        return constants.KPI.CLICKS;
      case constants.KPI.CTR.key:
        return constants.KPI.CTR;
      case constants.KPI.CONVERSION.key:
        return constants.KPI.CONVERSION;
      case constants.KPI.CVR.key:
        return constants.KPI.CVR;
      case constants.KPI.CPM.key:
        return constants.KPI.CPM;
      case constants.KPI.CPC.key:
        return constants.KPI.CPC;
      case constants.KPI.CPO.key:
        return constants.KPI.CPO;
      case constants.KPI.COST.key:
        return constants.KPI.COST;
      case constants.KPI.ORDER_VALUE.key:
        return constants.KPI.ORDER_VALUE;
      case constants.KPI.MARGIN.key:
        return constants.KPI.MARGIN;
      case constants.KPI.ROI.key:
        return constants.KPI.ROI;
      default:
        return null;
    }
  }

  sort({ sortBy, sortDirection }) {
    this.setState({ sortBy, sortDirection });
  }

  rowClassName({ index }) {
    if (index < 0) {
      return styles.headerRow;
    }
    const campaignID = this.currentList[index][constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN].id;
    const selectedRow = this.props.selectedCampaign && campaignID === this.props.selectedCampaign.id ? true : null;
    return selectedRow ? styles.selectedRow : index % 2 === 0 ? styles.evenRow : styles.oddRow; // eslint-disable-line no-nested-ternary
  }

  noRowsRenderer() {
    return (
      <div className={styles.noRows}>
        No campaign data available
      </div>
    );
  }

  cellRenderer({ cellData, dataKey, rowData }) {
    const campaign = rowData[constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN];
    if (dataKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS) {
      let switchCell = null;
      if (campaign.changed === 'loading') {
        switchCell = (
          <ToggleSwitch
            checked={cellData}
            loading
            onChange={() => this.handleToggleSwitchClick(campaign.id, !cellData)}
          />
        );
      } else {
        switchCell = (
          <ToggleSwitch
            checked={cellData}
            onChange={() => this.handleToggleSwitchClick(campaign.id, !cellData)}
          />
        );
      }

      return (
        <div className={classnames(styles.cell, styles.statusCell)}>
          {switchCell}
        </div>
      );
    }

    if (dataKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN) {
      return (
        <div className={classnames(styles.cell)}>
          <div className={styles.campaignName}>{cellData.name}</div>
          <div>
            <div className={styles.campaignBudget}>
              <span className={styles.campaignAmountIcon}>
                <CampaignAmountIcon />
              </span>
              {`$${cellData.budgetRemaining && cellData.budgetRemaining.toFixed(2) || '0.00'} left`}
            </div>
            <div className={styles.campaignEndDate}>
              <span className={styles.campaignTimeIcon}>
                <CampaignTimeIcon />
              </span>
              {formatDate(cellData.endDate, 'DD.MM.YY')}
            </div>
          </div>
        </div>
      );
    }
    const isSecondHalf = this.props.headers.indexOf(dataKey) >= 2;
    return isSecondHalf ? <div className={classnames(styles.cell, styles.secondHalfColummn)}>{cellData}</div> :
      <div className={styles.cell}>{cellData}</div>;
  }

  handleRowSelect({ index }) {
    const campaign = this.currentList[index].campaign;
    if (campaign && campaign.changed !== 'loading') {
      this.props.onRowSelect(this.currentList[index].campaign);
    }
  }

  handleToggleSwitchClick(campaignId, status) {
    this.props.onToggleSwitchClick(campaignId, status);
  }

  headerRenderer({
    dataKey,
    label,
    sortBy,
    sortDirection,
  }) {
    const isSecondHalf = this.props.headers.indexOf(dataKey) >= 2;
    const className = classnames(
      styles.header, {
        [styles.secondHalfColummn]: isSecondHalf,
      });
    return (
      <div className={className}>
        {sortBy === dataKey && isSecondHalf && <SortIndicator sortDirection={sortDirection} />}
        {this.getHeaderLabel(label)}
        {sortBy === dataKey && !isSecondHalf && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  formatValue(kpiKey, value, campaign) {
    if (kpiKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN || kpiKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS) {
      return value;
    }
    const valueType = this.getKPIFromKey(kpiKey).valueType;
    return formatNumericValue(value, valueType, campaign.currency, this.props.intl);
  }

  formatRow(row) {
    return Object.keys(row).reduce((accumulator, kpi) => {
      accumulator[kpi] = this.formatValue(kpi, row[kpi], row[constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN]); // eslint-disable-line no-param-reassign
      return accumulator;
    }, {});
  }

  /*  TODO USE INTL TO TRANSLATE HEADERS */
  render() {
    const {
      headerHeight,
      height,
      overscanRowCount,
      rowHeight,
      scrollToIndex,
      sortBy,
      sortDirection,
    } = this.state;

    const { list, headers } = this.props;
    let sortedList = Object.values(list).sort((first, second) => (first[sortBy] < second[sortBy] ? -1 : 1));
    sortedList = sortDirection === SortDirection.DESC ? sortedList.reverse() : sortedList;
    this.currentList = sortedList.map(it => this.formatRow(it));
    const rowGetter = ({ index }) => this.getDatum(this.currentList, index);
    return (
      <div className={styles.campaignTable}>
        <AutoSizer disableHeight>
          {({ width }) => (
            <FlexTable
              ref="Table"
              headerClassName={styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this.noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={::this.rowClassName}
              onRowClick={::this.handleRowSelect}
              rowHeight={rowHeight}
              rowCount={Math.min(this.currentList.length, 50)}
              scrollToIndex={scrollToIndex}
              sort={this.sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
              rowGetter={rowGetter}
            >
              {headers.map(
                header => (
                  <FlexColumn
                    key={header}
                    label={header}
                    dataKey={header}
                    disableSort={false}
                    width={this.getColumnWidth(header)}
                    flexGrow={1}
                    cellRenderer={this.cellRenderer}
                    headerRenderer={this.headerRenderer}
                  />
                )
              )}
            </FlexTable>
          )}
        </AutoSizer>

      </div>
    );
  }

}

CampaignTable.propTypes = {
  campaignData: PropTypes.object,
  list: PropTypes.object,
  headers: PropTypes.array,
  onRowSelect: PropTypes.func,
  onToggleSwitchClick: PropTypes.func,
  onAddAlert: PropTypes.func,
  selectedCampaign: PropTypes.object,
  intl: PropTypes.object,
  toggledCampaign: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
};

export default injectIntl(CampaignTable);
