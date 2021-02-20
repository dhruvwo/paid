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

const getInvoices = (
  accountId,
  filter_total,
  startAfter,
  filter_customer,
  created,
  status,
  dueDate,
) => {
  return (dispatch) => {
    return invoice
      .invoices(
        accountId,
        filter_total,
        startAfter,
        filter_customer,
        created,
        status,
        dueDate,
      )
      .then((response) => {
        if (response.status === 'success') {
          if (startAfter) {
            dispatch(appendInvoice(response));
          } else {
            dispatch(setInvoice(response));
          }
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
