import {API_URL} from '../../../env.json';
import axios from 'axios';
import Default from '../../constants/Default';

const invoices = async (filters) => {
  const {
    accountId,
    filterTotal,
    startAfter,
    filterCustomer,
    created,
    status,
    dueDate,
  } = filters;
  let params = {
    accountId: accountId,
    perPage: Default.perPageLimit,
    filterData: {
      filter_total: filterTotal,
      filter_customer: filterCustomer,
      created: created,
      status: status,
    },
  };
  if (startAfter) {
    params['startAfter'] = startAfter;
  }
  if (status === 'open') {
    params['filterData']['due_date'] = dueDate;
  }

  return axios
    .get(`${API_URL}/billing/payments/get-stripe-invoices`, {
      params,
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

const quickPay = async (data) => {
  return axios
    .request({
      method: 'POST',
      url: `${API_URL}/billing/payments/pay-now`,
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
  quickPay,
};
