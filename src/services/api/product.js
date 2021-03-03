import {API_URL} from '../../../env.json';
import axios from 'axios';
import Default from '../../constants/Default';

const products = async ({accountId, searchText, start}) => {
  return axios
    .get(`${API_URL}/billing/payments/stripe-product`, {
      params: {
        accountId: accountId,
        perPage: Default.perPageLimit,
        filter: {
          filter_name: searchText,
          start: start || 0,
          limit: Default.perPageLimit,
          filter_currency: Default.currency,
          filter_type: 'one_time',
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

export const product = {
  products,
};
