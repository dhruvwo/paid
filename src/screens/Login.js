import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';

export default function Login(props) {
  return (
    <View style={GlobalStyles.mainView}>
      <Text>Login Screen..</Text>
      <TouchableOpacity
        style={GlobalStyles.buttonContainer}
        onPress={() => props.navigation.replace('DrawerNavigator')}>
        <Text style={GlobalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
