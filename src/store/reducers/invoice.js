import {InvoiceState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  invoices: [],
  has_more: true,
};

export const invoice = (state = initialState, action) => {
  switch (action.type) {
    case InvoiceState.SET_INVOICE:
      return {
        invoices: _.uniqBy(action.data.invoices.data, 'id'),
        has_more: action.data.invoices.has_more,
      };
    case InvoiceState.APPEND_INVOICE:
      const invoices = _.uniqBy(
        [...state.invoices, ...action.data.invoices.data],
        'id',
      );
      return {
        invoices,
        has_more: action.data.invoices.has_more,
      };
    case InvoiceState.CLEAR_INVOICE:
      return initialState;
    default:
      return state;
  }
};
