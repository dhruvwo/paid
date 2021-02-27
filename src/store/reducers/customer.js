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
        customers: _.uniqBy(action.data.customers, '_id'),
        hasMore: !!action.data.customers.length,
      };
    case CustomerState.APPEND_CUSTOMERS:
      const customers = _.uniqBy(
        [...state.customers, ...action.data.customers],
        '_id',
      );
      return {
        customers,
        hasMore: !!action.data.customers.length,
      };
    case CustomerState.CLEAR_CUSTOMERS:
      return initialState;
    default:
      return state;
  }
};
