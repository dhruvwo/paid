import {API_URL} from '../../../env.json';
import axios from 'axios';

const login = async (email) => {
  return axios
    .request({
      url: `${API_URL}/access/sessions?identifier=${email}`,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      console.error('error in login api!!', error);
      return Promise.reject(error);
    });
};

export const auth = {
  login,
};
