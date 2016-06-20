import React, { Component, PropTypes } from 'react';
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown';
import constants from '../../constants';

class CampaignFilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.options = [
      { value: constants.STATUS.ALL, label: 'All Campaigns' },
      { value: constants.STATUS.ACTIVE, label: 'Active Campaigns' },
      { value: constants.STATUS.INACTIVE, label: 'Inactive Campaigns' },
    ];
    this.state = this.options.find(it => this.props.initialValue === it.value) || this.options[0];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCampaign) {
      this.setState({ value: nextProps.selectedCampaign.id, label: nextProps.selectedCampaign.name, disabled: true });
    }
  }

  handleOnChange(value) {
    this.setState(this.options.find(it => value === it.value) || this.options[0]);
    this.props.onChange(value);
  }

  render() {
    const options = [...this.options];
    if (this.props.selectedCampaign) {
      options.push({ value: this.props.selectedCampaign.id, label: this.props.selectedCampaign.name, disabled: true });
    }
    return (
      <Dropdown
        value={this.state}
        onChange={this.handleOnChange}
      >
        {options
          .map(item => <DropdownItem key={item.value} value={item}>{item.label}</DropdownItem>)
        }
      </Dropdown>
    );
  }
}
CampaignFilterDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  selectedCampaign: PropTypes.object,
};
export default CampaignFilterDropdown;
