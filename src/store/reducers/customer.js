import {CustomerState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  customers: [],
  total: 0,
};

export const customer = (state = initialState, action) => {
  switch (action.type) {
    case CustomerState.SET_CUSTOMERS:
      return {
        customers: action.data.customers,
        total: action.data.total,
      };
    case CustomerState.APPEND_CUSTOMERS:
      const customers = _.uniqBy([
        ...state.customers,
        ...action.data.customers,
      ]);
      return {
        customers,
        total: action.data.total,
      };
    default:
      return state;
  }
};
