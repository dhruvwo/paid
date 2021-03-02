import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import AppNavigator from './AppNavigator';
import {axiosInterceptor} from './src/services/interceptor';
import {useDispatch} from 'react-redux';
import {FileLogger} from 'react-native-file-logger';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    axiosInterceptor(dispatch);
  }, []);
  FileLogger.configure();
  return <AppNavigator />;
};

export default App;
