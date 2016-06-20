import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Overlay } from 'react-overlays';
import styles from './Dropdown.scss';
import { SelectArrowIcon } from '../../theme/assets';

export function DropdownItem({ children, value, currentValue, onChange }) { // eslint-disable-line react/prop-types
  const className = {
    [styles.selected]: currentValue.value === value.value,
    [styles.disabled]: value.disabled,
  };
  return (
    <div
      onClick={value.disabled ? undefined : (event) => onChange(event, value.value)}
      className={classnames(className)}
    >
      {children}
    </div>
  );
}

function DropdownCurrent({ value }) { // eslint-disable-line react/prop-types
  return (
    <div>
      {value.label}
    </div>
  );
}

class Dropdown extends Component {
  constructor(props) {
    super(props);

    // Binding
    this.handleOnHide = this.handleOnHide.bind(this);
    this.handleOnShow = this.handleOnShow.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);

    this.state = {
      show: false,
    };
  }

  handleOnHide() {
    this.setState({
      show: false,
    });
  }

  handleOnShow(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      show: true,
    });
  }

  handleOnChange(event, value) {
    event.stopPropagation();
    event.preventDefault();
    this.props.onChange(value);
    this.handleOnHide();
  }

  render() {
    const {
      value,
      currentContainer,
      children,
      className,
      ...otherProps,
    } = this.props;
    return (
      <div onClick={this.handleOnShow} className={classnames('row', styles.dropdown, className, this.state.show ? styles.active : '')} {...otherProps}>
        <div
          className={classnames('row Dropdown--Header')}
          ref={element => this._dropdown = element} // eslint-disable-line no-return-assign, no-underscore-dangle
        >
          <div className={classnames(styles.current)}>
            {React.cloneElement(currentContainer, { value })}
          </div>
          <div className={classnames(styles.icon)}>
            <SelectArrowIcon />
          </div>
        </div>
        <Overlay
          placement="bottom"
          onHide={this.handleOnHide}
          show={this.state.show}
          container={this}
          target={() => this._dropdown} // eslint-disable-line no-underscore-dangle
          rootClose
        >
          <div className={classnames('Dropdown--Overlay', styles.overlay)}>
            {React.Children
              .toArray(children)
              .filter((child) => child.type === DropdownItem)
              .map((child) => (
                React.cloneElement(child, { onChange: this.handleOnChange, currentValue: value })
              ))
            }
          </div>
        </Overlay>
      </div>
    );
  }
}

Dropdown.propTypes = {
  value: PropTypes.any.isRequired,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  currentContainer: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  itemContainer: <DropdownItem />,
  currentContainer: <DropdownCurrent />,
};

export default Dropdown;
