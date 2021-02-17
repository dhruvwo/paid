import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const axiosInterceptor = (dispatch) => {
  axios.interceptors.request.use(
    async (request) => {
      let apiServiceResponse = await AsyncStorage.getItem('apiServiceResponse');
      let authenticationResponse = await AsyncStorage.getItem(
        'authenticationResponse',
      );
      apiServiceResponse = JSON.parse(apiServiceResponse);
      authenticationResponse = JSON.parse(authenticationResponse);

      // console.log('apiServiceResponse', apiServiceResponse);
      // console.log('authenticationResponse', authenticationResponse);
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

      if (authenticationResponse && authenticationResponse.token) {
        request.headers = {
          ...request.headers,
          // 'X-Paid-Service-Id': '',
          // 'X-Paid-Service-Key': '',
          'X-Paid-User-Session-Id': authenticationResponse.callerId,
          'X-Paid-User-Session-Key': authenticationResponse.sessionKey,
          'X-Paid-User-Token': authenticationResponse.token,
          'X-Paid-User-Username': authenticationResponse.email,
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
