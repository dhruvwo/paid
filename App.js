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
  FileLogger.configure(
    (Option = {
      // dailyRolling: true,
      // maximumFileSize: 1024 * 1024,
      // maximumNumberOfFiles: 5,
    }),
  );
  FileLogger.info('log starting');
  return <AppNavigator />;
};

export default App;
