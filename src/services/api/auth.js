import {API_URL} from '../../../env.json';
import axios from 'axios';

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

export const auth = {
  login,
};
