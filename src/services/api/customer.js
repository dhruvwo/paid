import {API_URL} from '../../../env.json';
import axios from 'axios';
import Default from '../../constants/Default';

const customers = async ({accountId, searchText, start}) => {
  //`${API_URL}/billing/payments/stripe-customer-by-account`
  return axios
    .get(`${API_URL}/billing/payments/get-all-customers`, {
      params: {
        accountId,
        perPage: Default.perPageLimit,
        filter: {
          filter_name: searchText,
          start: start || 0,
          limit: Default.perPageLimit,
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

const addCustomer = async (data) => {
  return axios
    .request({
      method: 'POST',
      url: `${API_URL}/billing/payments/stripe-customer-by-account`,
      data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const customer = {
  customers,
  addCustomer,
};
