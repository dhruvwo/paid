import {CustomerState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  customers: [],
  hasMore: true,
};

export const customer = (state = initialState, action) => {
  switch (action.type) {
    case CustomerState.SET_CUSTOMERS:
      return {
        customers: action.data.customers,
        hasMore: !!action.data.customers.length,
      };
    case CustomerState.APPEND_CUSTOMERS:
      const customers = _.uniqBy([
        ...state.customers,
        ...action.data.customers,
      ]);
      return {
        customers,
        hasMore: !!action.data.customers.length,
      };
    default:
      return state;
  }
};
