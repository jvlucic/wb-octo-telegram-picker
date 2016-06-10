import React, { PropTypes } from 'react';
import './styles.scss';
import classnames from 'classnames';

const noop = () => {};

export default function KPIButton({ name, value, symbol, percentage, selected, className, enabled, onClick = noop, ...otherProps }) {
  const isSelected = classnames({
    'is-selected': selected,
  });
  const isEnabled = classnames({
    'is-enabled': enabled,
  });
  return (
    <article
      {...otherProps}
      onClick={onClick}
      className={classnames('KPI', isSelected, isEnabled, className)}
    >
      <header className={classnames('KPI-name')}>{name}</header>
      <content className={classnames('KPI-content')}>
        <span className="KPI-value">{value}</span>
        <span className="KPI-symbol">{symbol}</span>
      </content>
      <footer className="KPI-variation">
        {/* TODO: Change unicode for real svg*/}
        <span
          className={classnames('KPI-icon', {
            'KPI-icon--up': percentage > 0,
            'KPI-icon--down': percentage < 0,
          })}
        >
          {
            (percentage > 0 ? '↑' : percentage < 0 ? '↓' : '') // eslint-disable-line no-nested-ternary
          }
        </span>
        <span className="KPI-percentage">{percentage}%</span>
      </footer>
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
  onClick: PropTypes.func,
  className: PropTypes.string,
};

KPIButton.defaultProps = {
  type: 'normal',
  selected: false,
};
