import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';

export default function Login(props) {
  return (
    <View style={GlobalStyles.mainView}>
      <Text>Product List Screen</Text>
      <TouchableOpacity
        style={GlobalStyles.buttonContainer}
        onPress={() => props.navigation.navigate('Checkout')}>
        <Text style={GlobalStyles.buttonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
