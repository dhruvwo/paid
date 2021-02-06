import axios from 'axios';

export const axiosInterceptor = (dispatch) => {
  axios.interceptors.request.use(
    async (request) => {
      // You can modify or control request
      request.headers = {
        ...request.headers,
        'Content-Type': 'application/json',
      };
      if (token) {
        request.headers = {
          ...request.headers,
          //   authorization: `Basic ${token}`,
          //   'x-pre-api-version': 4,
        };
      }
      return request;
    },
    (err) => {
      console.error('error in interceptor request!!', err);
      // Handle errors
      throw err;
    },
  );
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};
