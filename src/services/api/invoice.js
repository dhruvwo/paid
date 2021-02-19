import {API_URL} from '../../../env.json';
import axios from 'axios';
import Default from '../../constants/Default';

const invoices = async (accountId, filter_total, filter_customer, created) => {
  return axios
    .get(`${API_URL}/billing/payments/stripe-invoices`, {
      params: {
        accountId: accountId,
        perPage: Default.perPageLimit,
        filterData: {
          filter_total: filter_total,
          filter_customer: filter_customer,
          created: created,
        },
      },
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const sendInvoice = async (data) => {
  return axios
    .request({
      method: 'POST',
      url: `${API_URL}/billing/payments/send-invoice`,
      //   data : data,
      data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const invoice = {
  invoices,
  sendInvoice,
};
