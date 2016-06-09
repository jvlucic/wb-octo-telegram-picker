import React, { PropTypes } from 'react';
import './styles.scss';
import classnames from 'classnames';

const noop = () => {};

export default function KPIButton({ name, value, symbol, type, percentage, active, className, onClick = noop, ...otherProps }) {
  const typeOfComponent = classnames({
    'is-kpi-impressions': type === 'impressions',
    'is-kpi-clicks': type === 'clicks',
    'is-kpi-ctr': type === 'ctr',
    'is-kpi-conversion': type === 'conversion',
    'is-kpi-cvr': type === 'cvr',
  });
  const isActive = classnames({
    'is-active': active,
  });
  let action = onClick;
  if (type === 'normal') {
    action = noop;
  }
  return (
    <article
      {...otherProps}
      onClick={action}
      className={classnames('KPI', typeOfComponent, isActive, className)}
    >
      <header className={classnames('KPI-name', typeOfComponent)}>{name}</header>
      <content className={classnames('KPI-content', typeOfComponent)}>
        <span className="KPI-value"></span>{value}
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
  type: PropTypes.oneOf(['normal', 'impressions', 'clicks', 'ctr', 'conversion', 'cvr']),
  percentage: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

KPIButton.defaultProps = {
  type: 'normal',
  active: false,
};
