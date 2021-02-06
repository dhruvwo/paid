import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import CalculatorComponent from "../components/calculator/Calculator";

export default function Calculator(props) {

    const styles = StyleSheet.create({
        mainView: {
            flex: 1,
        }
    });

  return (
    <View style={GlobalStyles.mainView}>
      <CalculatorComponent/>
    </View>
  );
}
