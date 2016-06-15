import { CHANGE_DATE_RANGE } from './constants';


export function changeDateRange({ to, from }) {
  return {
    type: CHANGE_DATE_RANGE,
    to,
    from,
  };
}
