import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import AppNavigator from './AppNavigator';
import {axiosInterceptor} from "./src/services/interceptor";
import {useDispatch} from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    axiosInterceptor(dispatch);
  }, []);

  return <AppNavigator />;
};

export default App;
