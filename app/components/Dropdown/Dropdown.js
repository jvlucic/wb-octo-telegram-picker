/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Overlay } from 'react-overlays';
import styles from './Dropdown.scss';
import { ArrowDownFillIcon } from 'theme/assets';

export function DropdownItem({ children, value, currentValue, onChange }) {
  return (
    <div onClick={() => onChange(value)} className={classnames({
      [styles.selected]: currentValue === value,
    })}>
      { children }
    </div>
  );
}

function DropdownCurrent({ value }) {
  return (
    <div>
      { value }
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

  handleOnShow() {
    this.setState({
      show: true,
    });
  }

  handleOnChange(value) {
    this.props.onChange(value);
    this.handleOnHide();
  }

  render() {
    const {
      value,
      currentContainer,
      children,
      onChange,
      className,
      ...otherProps,
    } = this.props;
    return (
      <div className={classnames('row', styles.dropdown, className)} {...otherProps}>
        <div
          className={classnames('row Dropdown--Header')}
          ref={element => this._dropdown = element}
          onClick={this.handleOnShow}
        >
          <div className={classnames(styles.current)}>
            {React.cloneElement(currentContainer, { value })}
          </div>
          <div className={classnames(styles.icon)}>
            <ArrowDownFillIcon />
          </div>
        </div>
        <Overlay
          placement="bottom"
          onHide={this.handleOnHide}
          show={this.state.show}
          container={this}
          target={() => this._dropdown}
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
