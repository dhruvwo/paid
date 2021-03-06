import {invoice} from '../../services/api';
import {InvoiceState} from '../../constants/GlobalState';

const setInvoice = (data) => ({
  type: InvoiceState.SET_INVOICE,
  data,
});

const appendInvoice = (data) => ({
  type: InvoiceState.APPEND_INVOICE,
  data,
});

const clearInvoices = (data) => ({
  type: InvoiceState.CLEAR_INVOICE,
  data,
});

const getInvoices = (filters) => {
  return (dispatch) => {
    return invoice
      .invoices(filters)
      .then((response) => {
        if (response.status === 'success') {
          if (filters.startAfter) {
            dispatch(appendInvoice(response));
          } else {
            dispatch(setInvoice(response));
          }
        }
        return response;
      })
      .catch((err) => {
        console.error('error in invoice action', err);
        FileLogger.error('error in invoice action', err);
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
        FileLogger.error('error in send invoice action', err);
        return err.response;
      });
  };
};

const sendQuickPayInvoice = (data) => {
  return (dispatch) => {
    return invoice
      .quickPay(data)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error('error in sending quick pay invoice action', err);
        FileLogger.error('error in sending quick pay invoice action', err);
        return err.response;
      });
  };
};

export const invoiceAction = {
  getInvoices,
  sendInvoice,
  sendQuickPayInvoice,
  clearInvoices,
};
