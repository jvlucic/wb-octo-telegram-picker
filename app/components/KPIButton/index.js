/* eslint-disable */
import React, { PropTypes } from 'react';
import './styles.scss'; // eslint-disable-line
import classnames from 'classnames';
import styles from './styles.scss'; // eslint-disable-line
import constants from '../../constants';
import {KPIUpIcon, KPIDownIcon, KPIEqualIcon} from '../../theme/assets'
import { numberFormatter } from '../../utils/utils'
const noop = () => {
};



function renderContent(value, valueType, currency) {
  let formattedValue = null;
  let symbol = null;
  switch (valueType) {
    case constants.VALUE_TYPE.CURRENCY: {
      formattedValue = numberFormatter(value);
      symbol = currency;
      break;
    }
    case constants.VALUE_TYPE.PERCENTAGE: {
      formattedValue = (value).toFixed(2);
      symbol = '%';
      break;
    }
    case constants.VALUE_TYPE.NUMBER: {
      formattedValue = numberFormatter(value);
      break;
    }
    default:
      return value;
  }

  return (
    <content className={classnames('KPI-content')}>
      <span className="KPI-value">{formattedValue}</span>
      {symbol && <span className="KPI-symbol">{symbol}</span> }
    </content>
  );
}


export default function KPIButton({ name, value, symbol, percentage,
  selected, className, enabled, color, valueType, hovered, colorHovered, onClick = noop, ...otherProps }) {
  const isSelected = classnames({
    'is-selected': selected,
  });
  const isEnabled = classnames({
    'is-enabled': enabled,
  });
  const isHovered = classnames({
    'is-hovered': hovered,
  });
  const style = {
    backgroundColor: isEnabled && hovered ? colorHovered : 'white',
  };
  const charIndicatorStyle = {
    borderColor: isEnabled && (hovered || selected) ? color : '#E0E0E0',
  };
  const charIndicatorInnerCircleStyle = {
    display: selected ? 'block' : 'none',
    backgroundColor: selected ? color : '#E0E0E0',
    ...charIndicatorStyle,
  };
  return (
    <article
      {...otherProps}
      onClick={onClick}
      style={style}
      className={classnames('KPI', isSelected, isEnabled, className, isHovered)}
    >
      <div className={classnames('KPI-chart-indicator')}>
        <div className={classnames('KPI-circle')} style={charIndicatorStyle}>
          <div className={classnames('KPI-circle-inner')} style={charIndicatorInnerCircleStyle}></div>
        </div>
        <div className={classnames('KPI-line')} >
          <hr style={charIndicatorStyle} />
        </div>
      </div>
      <div className={classnames('KPI-inner-container')}>
        <header className={classnames('KPI-name')}>{name}</header>
        {renderContent(value, valueType, symbol)}
        <footer className="KPI-variation">
          {/* TODO: Change unicode for real svg*/}
          <span
            className={classnames('KPI-icon', {
              'KPI-icon--up': percentage > 0,
              'KPI-icon--down': percentage < 0,
            })}
          >
            {
              (percentage > 0 ? <KPIUpIcon/> : percentage < 0 ? <KPIDownIcon/> : <KPIEqualIcon/>) // eslint-disable-line no-nested-ternary
            }
          </span>
          <span className="KPI-percentage">{percentage.toFixed(2)}%</span>
        </footer>
      </div>
    </article>
  );
}

KPIButton.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  enabled: PropTypes.bool,
  color: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

KPIButton.defaultProps = {
  type: 'normal',
  selected: false,
};
