import {API_URL} from '../../../env.json';
import axios from 'axios';

const getServiceKey = async () => {
  return axios
    .request({
      url: `${API_URL}/api/services/getPrimaryServiceKey`,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const getUserSetup = async () => {
  return axios
    .request({
      url: `${API_URL}/paid/user/setup`,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getKeys = {
  getServiceKey,
  getUserSetup,
};
