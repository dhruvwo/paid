import {API_URL} from '../../../env.json';
import axios from 'axios';
import Default from '../../constants/Default';

const products = async (accountId, filter_name, start) => {
  // axios
  //   .request({
  //     url: `${API_URL}/billing/payments/stripe-product?accountId=${accountId}&perPage=${perPage}&filter=%7B%22filter_name%22:%22${filter_name}%22,%22start%22:${start},%22limit%22:${limit}%7D`,
  //   })
  return axios
    .get(`${API_URL}/billing/payments/stripe-product`, {
      params: {
        accountId: accountId,
        perPage: Default.perPageLimit,
        filter: {
          filter_name: filter_name,
          start: start,
          limit: Default.perPageLimit,
          filter_currency: Default.currency,
          // filter_type:"one_time"
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
