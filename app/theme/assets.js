/**
 * Created by mongoose on 25/04/16.
 */
import React from 'react';
import AlertCloseSVG from '../../icons/alert-close.svg';
import AlertErrorSVG from '../../icons/alert-error.svg';
import AlertSuccessSVG from '../../icons/alert-success.svg';
import AlertWarningSVG from '../../icons/alert-warning.svg';
import CampaignAmountSVG from '../../icons/campaign-amount.svg';
import CampaignTimeSVG from '../../icons/campaign-time.svg';
import CaretLeftSVG from '../../icons/caret-left.svg';
import DownloadSVG from '../../icons/download.svg';
import InputCalendarSVG from '../../icons/input-calendar.svg';
import InputCheckboxSVG from '../../icons/input-checkbox.svg';
import InputClearSVG from '../../icons/input-clear.svg';
import InputErrorSVG from '../../icons/input-error.svg';
import InputPasswordSVG from '../../icons/input-password.svg';
import KPIDownSVG from '../../icons/kpi-down.svg';
import KPIEqualSVG from '../../icons/kpi-equal.svg';
import KPIUpSVG from '../../icons/kpi-up.svg';
import ResponseSuccessSVG from '../../icons/response-success.svg';
import SelectArrowSVG from '../../icons/select-arrow.svg';
import SwitchNoStateSVG from '../../icons/switch-nostate.svg';
import SwitchOffSVG from '../../icons/switch-off.svg';
import SwitchOnSVG from '../../icons/switch-on.svg';
import UnidesqLogoSVG from '../../icons/unidesq-logo.svg';


export const SvgIcon = ({ ...props, src }) => (
  <span
    {...props}
    dangerouslySetInnerHTML={{ __html: src }}
  >
  </span>
);

SvgIcon.propTypes = {
  src: React.PropTypes.string,
};

export const AlertCloseIcon = (props) => <SvgIcon {...props} src={AlertCloseSVG} />;
export const AlertErrorIcon = (props) => <SvgIcon {...props} src={AlertErrorSVG} />;
export const AlertSuccessIcon = (props) => <SvgIcon {...props} src={AlertSuccessSVG} />;
export const AlertWarningIcon = (props) => <SvgIcon {...props} src={AlertWarningSVG} />;
export const CampaignAmountIcon = (props) => <SvgIcon {...props} src={CampaignAmountSVG} />;
export const CampaignTimeIcon = (props) => <SvgIcon {...props} src={CampaignTimeSVG} />;
export const CaretLeftIcon = (props) => <SvgIcon {...props} src={CaretLeftSVG} />;
export const DownloadIcon = (props) => <SvgIcon {...props} src={DownloadSVG} />;
export const InputCalendarIcon = (props) => <SvgIcon {...props} src={InputCalendarSVG} />;
export const InputCheckboxIcon = (props) => <SvgIcon {...props} src={InputCheckboxSVG} />;
export const InputClearIcon = (props) => <SvgIcon {...props} src={InputClearSVG} />;
export const InputErrorIcon = (props) => <SvgIcon {...props} src={InputErrorSVG} />;
export const InputPasswordIcon = (props) => <SvgIcon {...props} src={InputPasswordSVG} />;
export const KPIDownIcon = (props) => <SvgIcon {...props} src={KPIDownSVG} />;
export const KPIEqualIcon = (props) => <SvgIcon {...props} src={KPIEqualSVG} />;
export const KPIUpIcon = (props) => <SvgIcon {...props} src={KPIUpSVG} />;
export const ResponseSuccessIcon = (props) => <SvgIcon {...props} src={ResponseSuccessSVG} />;
export const SelectArrowIcon = (props) => <SvgIcon {...props} src={SelectArrowSVG} />;
export const SwitchNoStateIcon = (props) => <SvgIcon {...props} src={SwitchNoStateSVG} />;
export const SwitchOffIcon = (props) => <SvgIcon {...props} src={SwitchOffSVG} />;
export const SwitchOnIcon = (props) => <SvgIcon {...props} src={SwitchOnSVG} />;
export const UnidesqLogoIcon = (props) => <SvgIcon {...props} src={UnidesqLogoSVG} />;
