import {auth, getKeys} from '../../services/api';
import {AuthState} from '../../constants/GlobalState';

const setKey = (data) => ({
  type: AuthState.SET_KEY,
  data,
});

const setUser = (data) => ({
  type: AuthState.SET_USER,
  data,
});

// const updateSessionKey = (dispatch, response) => {

//   const key = response.key;
//   const serviceId = response.serviceId;
//   dispatch(setKey({key, serviceId}));
// };

const getServiceKey = () => {
  return (dispatch) => {
    return getKeys
      .getServiceKey()
      .then((response) => {
        if (response.status === 'success') {
          dispatch(setKey(response.APIServiceRequest));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in getServiceKey action', err);
        return err.response;
      });
  };
};

const login = (email, password) => {
  return (dispatch) => {
    return auth
      .login(email, password)
      .then((response) => {
        if (response.status === 'success' && response.authenticated) {
          dispatch(setUser(response.AuthenticationResponse));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in login action', err);
        return err.response;
      });
  };
};

export const authAction = {
  login,
  getServiceKey,
};
