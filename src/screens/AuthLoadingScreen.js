import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Colors from '../constants/Colors';
import {authAction} from '../store/actions';
import {useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {navigate} from '../RootNavigation';

export default function AuthLoadingScreen(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserToken() {
      let apiServiceResponse = await AsyncStorage.getItem('apiServiceResponse');
      apiServiceResponse = JSON.parse(apiServiceResponse);
      let authenticationResponse = await AsyncStorage.getItem(
        'authenticationResponse',
      );
      authenticationResponse = JSON.parse(authenticationResponse);
      let userSetup = await AsyncStorage.getItem('userSetup');
      userSetup = JSON.parse(userSetup);
      if (authenticationResponse && authenticationResponse.token) {
        dispatch(authAction.setKey(apiServiceResponse));
        dispatch(authAction.setUser(authenticationResponse));
        dispatch(authAction.setUserSetup(userSetup));
      }
      SplashScreen.hide();
      let pageName = 'Login';
      if (authenticationResponse && authenticationResponse.token) {
        pageName = 'DrawerNavigator';
      }
      // props.navigation.navigate(pageName);
      navigate(pageName, {reset: true});
    }
    getUserToken();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
