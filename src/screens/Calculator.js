import React from 'react';
import {View, Text} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';

export default function Calculator(props) {
  return (
    <View style={GlobalStyles.mainView}>
      <Text>Calculator Screen</Text>
    </View>
  );
}
