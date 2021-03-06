import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  tax: 0,
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case AuthState.SET_KEY:
      AsyncStorage.setItem('apiServiceResponse', JSON.stringify(action.data));
      return {
        ...state,
        apiServiceResponse: action.data,
      };
    case AuthState.SET_USER:
      AsyncStorage.setItem(
        'authenticationResponse',
        JSON.stringify(action.data),
      );
      return {
        ...state,
        authenticationResponse: action.data,
      };
    case AuthState.SET_USER_SETUP:
      AsyncStorage.setItem('userSetup', JSON.stringify(action.data));
      return {
        ...state,
        userSetup: action.data,
      };
    case AuthState.SET_TAX:
      AsyncStorage.setItem('tax', JSON.stringify(action.data));
      return {
        ...state,
        tax: action.data,
      };
    case AuthState.CLEAR_USER:
      AsyncStorage.removeItem('authenticationResponse');
      AsyncStorage.removeItem('userSetup');
      AsyncStorage.removeItem('tax');
      return {
        ...state,
        authenticationResponse: '',
        userSetup: '',
        tax: 0,
      };
    default:
      return state;
  }
};
