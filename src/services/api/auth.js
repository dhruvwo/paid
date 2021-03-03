import {API_URL} from '../../../env.json';
import axios from 'axios';
import Default from '../../constants/Default';

const login = async (email, password) => {
  return axios
    .request({
      method: 'POST',
      url: `${API_URL}/accounts/authenticate`,
      data: {
        username: email,
        password: password,
      },
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const getTax = async (accountId) => {
  return axios
    .get(`${API_URL}/billing/payments/stripe-tax-rates`, {
      params: {
        accountId: accountId,
        perPage: Default.perPageLimit,
        filter: {
          filter_currency: Default.currency,
          filter_status: true,
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

export const auth = {
  login,
  getTax,
};
