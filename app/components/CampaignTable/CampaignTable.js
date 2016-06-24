/**
 * Created by mongoose on 8/06/16.
 */
/* eslint-disable */
import React, {PropTypes, Component} from 'react';
import styles from './CampaignTable.scss';
import {FlexTable, FlexColumn, AutoSizer, SortIndicator, SortDirection} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import shallowCompare from 'react-addons-shallow-compare'
import constants from '../../constants';
import classnames from 'classnames';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import Loader from '../Loader/Loader';


class CampaignTable extends Component {

  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/
  constructor(props, context) {
    super(props, context);

    this.state = {
      headerHeight: 50,
      height: (props.list.length + 1) * 70,
      overscanRowCount: 10,
      rowHeight: 70,
      rowCount: props.list.length,
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
    this.handleToggleSwitchClick = this.handleToggleSwitchClick.bind(this);
    this.sort = this.sort.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  handleRowSelect(campaign, event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRowSelect(campaign);
  }  
  
  handleToggleSwitchClick(campaignId, status) {
    this.props.onToggleSwitchClick(campaignId, status);
  }

  cellRenderer({cellData, columnData, dataKey, rowData, rowIndex, ...props}) {
    const campaign = rowData[constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN];
    if (dataKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.STATUS) {
      let switchCell = null;
      if (campaign.changed === 'loading'){
        switchCell = <Loader className={styles.toggleLoader}/>
      } else {
        switchCell = (
          <ToggleSwitch
            checked={cellData}
            onChange={() => this.handleToggleSwitchClick(campaign.id, !cellData)}/>
        );
      }
      return (
        <div className={classnames(styles.cell, styles.statusCell)}>
          { switchCell }
        </div>
      )
    }

    if (dataKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN) {
      return (
        <div className={classnames(styles.cell)} onClick={(event) => this.handleRowSelect(campaign, event)}>
          <div className={styles.campaignName}>{cellData.name}</div>
          <div>
            <div className={styles.campaignBudget}>{cellData.budget}</div>
            <div className={styles.campaignEndDate}>{cellData.endDate}</div>
          </div>
        </div>
      )
    }
    const isSecondHalf = this.props.headers.indexOf(dataKey) >= 2;
    return isSecondHalf ? <div className={classnames(styles.cell, styles.secondHalfColummn)}>{cellData}</div> : <div className={styles.cell}>{cellData}</div>
  }

  headerRenderer({
    columnData,
    dataKey,
    disableSort,
    label,
    sortBy,
    sortDirection
  }) {
    const isSecondHalf = this.props.headers.indexOf(dataKey) >= 2;
    const className = classnames(
      styles.header, {
      [styles.secondHalfColummn]: isSecondHalf,
    });
    return (
      <div className={className}>
        { sortBy === dataKey && isSecondHalf && <SortIndicator sortDirection={sortDirection}/> }
        {label}
        { sortBy === dataKey && !isSecondHalf && <SortIndicator sortDirection={sortDirection}/> }
      </div>
    );
  }

  noRowsRenderer() {
    return (
      <div className={styles.noRows}>
        No campaign data available
      </div>
    )
  }
  
  rowClassName({index, ...props}) {
    if (index < 0) {
      return styles.headerRow
    } else {
      const campaignID = this.currentList[index][constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN].id;
      const selectedRow = this.props.selectedCampaign && campaignID === this.props.selectedCampaign.id ? true : null;
      return selectedRow ?  styles.selectedRow : index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  sort({sortBy, sortDirection}) {
    this.setState({sortBy, sortDirection})
  }

  getDatum(list, index) {
    return list[index % list.length]
  }

  getRowHeight ({ index }) {
    /*TODO: IMPLEMENT */
    return this.state.rowHeight;
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
      sortDirection
    } = this.state;

    const {list, headers, ...props} = this.props;

    let sortedList = [...list].sort((first, second) => ( first[sortBy] < second[sortBy] ? -1 : 1 ));
    sortedList = sortDirection === SortDirection.DESC ? sortedList.reverse() : sortedList;
    const rowCount = sortedList.length;
    this.currentList = sortedList;
    const rowGetter = ({index}) => this.getDatum(this.currentList, index);
    return (
      <div className={styles.campaignTable}>
        <AutoSizer disableHeight>
          {({width}) => (
            <FlexTable
              ref="Table"
              headerClassName={styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this.noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={::this.rowClassName}
              rowHeight={rowHeight}
              rowCount={rowCount}
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
                    width={120}
                    flexGrow={ header === constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN ? 1 : 0}
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
  onRowSelect: PropTypes.func,
  onToggleSwitchClick: PropTypes.func,
  selectedCampaign: PropTypes.object,
};

export default CampaignTable;
