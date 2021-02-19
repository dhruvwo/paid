import {InvoiceState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  invoices: [],
};

export const invoice = (state = initialState, action) => {
  switch (action.type) {
    case InvoiceState.SET_INVOICE:
      return {
        invoices: action.data.invoices,
      };
    default:
      return state;
  }
};
