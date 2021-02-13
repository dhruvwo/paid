import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {};

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
    default:
      return state;
  }
};
