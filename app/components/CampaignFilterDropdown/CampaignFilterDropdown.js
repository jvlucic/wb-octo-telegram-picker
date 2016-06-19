import React, { Component, PropTypes } from 'react';
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown';
import constants from '../../constants';

class CampaignFilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.options = [
      { value: constants.STATUS.ACTIVE, label: 'Active' },
      { value: constants.STATUS.ALL, label: 'All Campaigns' },
      { value: constants.STATUS.INACTIVE, label: 'Inactive' },
    ];
    this.state = this.options.find(it => this.props.initialValue === it.value) || this.options[0];
  }

  handleOnChange(value) {
    this.setState(this.options.find(it => value === it.value) || this.options[0]);
    this.props.onChange(value);
  }

  render() {
    return (
      <Dropdown
        value={this.state}
        onChange={this.handleOnChange}
      >
        {this.options
          .map(item => <DropdownItem key={item.value} value={item.value}>{item.label}</DropdownItem>)
        }
      </Dropdown>
    );
  }
}
CampaignFilterDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
};
export default CampaignFilterDropdown;
