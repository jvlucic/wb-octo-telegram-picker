/**
 * Created by mongoose on 8/06/16.
 */
/* eslint-disable */
import React, {PropTypes, Component} from 'react';
import styles from './CampaignTable.scss';
import {FlexTable, FlexColumn, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import shallowCompare from 'react-addons-shallow-compare'
import constants from '../../constants';
import classnames from 'classnames';

const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC',
};

class CampaignTable extends Component {

  /* TODO: SHOW LOADER when no DATA IS AVAILABLE*/
  constructor(props, context) {
    super(props, context);

    this.state = {
      disableHeader: false,
      headerHeight: 50,
      height: 450,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 70,
      rowCount: props.list.length,
      scrollToIndex: undefined,
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
      useDynamicRowHeight: false,
    };

    this.getRowHeight = this.getRowHeight.bind(this);
    this.headerRenderer = this.headerRenderer.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.noRowsRenderer = this.noRowsRenderer.bind(this);
    this.onRowCountChange = this.onRowCountChange.bind(this);
    this.onScrollToRowChange = this.onScrollToRowChange.bind(this);
    this.sort = this.sort.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  getDatum(list, index) {
    return list[index % list.length]
  }

  getRowHeight({index}) {
    const {list} = this.props

    return this.getDatum(list, index).length
  }

  //const isSecondHalf = this.props.headers.indexOf(dataKey) >= Math.floor(this.props.headers.length / 2);
  cellRenderer({cellData, columnData, dataKey, rowData, rowIndex, ...props}) {
    if (dataKey === constants.CAMPAIGN_DATA_FIXED_HEADERS.CAMPAIGN) {
      return (
        <div className={styles.cell}>
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
    return isSecondHalf ? <div className={styles.secondHalfColummn}>{label}</div> : <div>{label}</div>
  }

  headerRenderer2({
    columnData,
    dataKey,
    disableSort,
    label,
    sortBy,
    sortDirection
  }) {
    return (
      <div>
        Full Name
        {sortBy === dataKey &&
        <SortIndicator sortDirection={sortDirection}/>
        }
      </div>
    )
  }

  isSortEnabled() {
    const {list} = this.props
    const {rowCount} = this.state

    return rowCount <= list.length
  }

  noRowsRenderer() {
    return (
      <div className={styles.noRows}>
        No rows
      </div>
    )
  }

  onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({rowCount})
  }

  onScrollToRowChange(event) {
    const {rowCount} = this.state
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({scrollToIndex})
  }

  rowClassName({index, ...props}) {
    if (index < 0) {
      return styles.headerRow
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  sort({sortBy, sortDirection}) {
    this.setState({sortBy, sortDirection})
  }

  updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value
    })
  }

  /*  TODO USE INTL TO TRANSLATE HEADERS */
  render() {
    const {
      disableHeader,
      headerHeight,
      height,
      hideIndexRow,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      useDynamicRowHeight
    } = this.state;

    const {list, headers, ...props} = this.props;

    let sortedList = [...list].sort((first, second) => ( first < second ? -1 : 1 ));
    sortedList = sortDirection === SortDirection.DESC ? sortedList.reverse() : sortedList;

    const rowGetter = ({index}) => this.getDatum(sortedList, index);
    return (
      <div className={styles.campaignTable}>
        <AutoSizer disableHeight>
          {({width}) => (
            <FlexTable
              ref="Table"
              disableHeader={disableHeader}
              headerClassName={styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this.noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={::this.rowClassName}
              rowHeight={useDynamicRowHeight ? this.getRowHeight : rowHeight}
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
};

export default CampaignTable;
