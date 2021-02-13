import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const axiosInterceptor = async (dispatch) => {
  let apiServiceResponse = await AsyncStorage.getItem('apiServiceResponse');
  apiServiceResponse = JSON.parse(apiServiceResponse);
  let authenticationResponse = await AsyncStorage.getItem(
    'authenticationResponse',
  );
  authenticationResponse = JSON.parse(authenticationResponse);

  console.log('apiServiceResponse', apiServiceResponse);
  console.log('authenticationResponse', authenticationResponse);

  axios.interceptors.request.use(
    async (request) => {
      // You can modify or control request
      request.headers = {
        ...request.headers,
        'Content-Type': 'application/json',
      };
      if (
        apiServiceResponse &&
        apiServiceResponse.serviceId &&
        apiServiceResponse.key
      ) {
        request.headers = {
          ...request.headers,
          'X-Paid-Service-Id': apiServiceResponse.serviceId,
          'X-Paid-Service-Key': apiServiceResponse.key,
        };
      }

      // if (authenticationResponse.token) {
      // request.headers = {
      //   ...request.headers,
      //     authorization: `Basic ${token}`,
      //     'x-pre-api-version': 4,
      // };
      // }

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
