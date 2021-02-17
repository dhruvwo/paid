import {auth, getKeys} from '../../services/api';
import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setKey = (data) => ({
  type: AuthState.SET_KEY,
  data,
});

const setUser = (data) => ({
  type: AuthState.SET_USER,
  data,
});

const setUserSetup = (data) => ({
  type: AuthState.SET_USER_SETUP,
  data,
});

const clearUser = (status) => ({
  type: AuthState.CLEAR_USER,
  status: status,
});

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
        if (
          response &&
          response.status === 'success' &&
          response.authenticated
        ) {
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

const getUserSetup = () => {
  return (dispatch) => {
    return getKeys
      .getUserSetup()
      .then((response) => {
        dispatch(setUserSetup(response));
        return response;
      })
      .catch((err) => {
        console.error('error in getServiceKey action', err);
        return err.response;
      });
  };
};

const logout = () => {
  return (dispatch) => {
    dispatch(clearUser());
    AsyncStorage.clear();
    return true;
  };
};

export const authAction = {
  setKey,
  getServiceKey,
  setUser,
  login,
  setUserSetup,
  getUserSetup,
  logout,
};
