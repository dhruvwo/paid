import {invoice} from '../../services/api';
import {InvoiceState} from '../../constants/GlobalState';

const setInvoice = (data) => ({
  type: InvoiceState.SET_INVOICE,
  data,
});

const getInvoices = (accountId, filter_name, start) => {
  return (dispatch) => {
    return invoice
      .getInvoices(accountId, filter_name, start)
      .then((response) => {
        if (response.status === 'success') {
          dispatch(setInvoice(response));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in invoice action', err);
        return err.response;
      });
  };
};

const sendInvoice = (data) => {
  return (dispatch) => {
    return invoice
      .sendInvoice(data)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error('error in send invoice action', err);
        return err.response;
      });
  };
};

export const invoiceAction = {
  getInvoices,
  sendInvoice,
};
