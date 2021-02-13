import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import Header from '../components/Header';
import Button from '../components/calculator/Button';
import * as _ from 'lodash';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import currencyFormatter from 'currency-formatter';
import {tax} from '../constants/Default';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const screen = Dimensions.get('window');

export default function CalculatorScreen(props) {
  const [currVal, setCurrVal] = useState(0);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(0);
  const [isDouble, setIsDouble] = useState(false);

  const notInplement = () => {
    return Alert.alert(``, `Not Implemented Yet!`, [
      {
        text: 'Close',
        style: 'cancel',
      },
    ]);
  };

  const handleTap = (type, value) => {
    if (type === 'number') {
      if (currVal < 100000) {
        if (currVal === 0) {
          setCurrVal(`${value}`);
        } else {
          setCurrVal(`${currVal}${value}`);
        }
      }
    }

    if (type === 'operator') {
      // setOperator(value);
      let historyArr = _.cloneDeep(history);
      const current = parseFloat(currVal);
      // console.log('current = ', current);
      historyArr.push(current);
      setHistory(historyArr);
      setIsDouble(false);
    }

    if (type === 'onlyClear') {
      setCurrVal(0);
      setIsDouble(false);
    }

    if (type === 'clear') {
      setCurrVal(0);
      setIsDouble(false);
      setHistory([]);
      setResult(0);
    }

    if (type === 'double') {
      setCurrVal(`${currVal}${'.'}`);
      setIsDouble(true);
    }
  };

  const onBackSpace = () => {
    let val = _.cloneDeep(currVal);
    let newVal = val.slice(0, -1);
    setCurrVal(newVal);
  };

  useEffect(() => {
    if (history.length) {
      // const current = parseFloat(currVal);
      // console.log('history --> ', history);
      var sum = history.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
      // console.log('total --> ', sum);
      setResult(sum);
      // setPrevVal(current);
      setCurrVal(0);
    }
  }, [history]);

  return (
    <SafeAreaView style={GlobalStyles.flexStyle}>
      <Header
        navigation={props.navigation}
        history={history}
        title={'Quick Pay'}
      />
      <KeyboardAwareScrollView
        extraScrollHeight={120}
        style={GlobalStyles.flexStyle}
        contentContainerStyle={{flexGrow: 1}}
        scrollEnabled={false}
        scrollIndicatorInsets={false}
        keyboardShouldPersistTaps="handled">
        <View style={[GlobalStyles.row, styles.container]}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountHeaderText}>Amount</Text>
            <Text style={styles.amountText}>
              {currencyFormatter.format(result, {
                code: 'USD',
              })}
            </Text>
          </View>
          <View style={[styles.amountContainer]}>
            <Text style={styles.amountHeaderText}>Tax</Text>
            <Text style={styles.amountText}>3%</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amountHeaderText, styles.totalHeaderText]}>
              Total
            </Text>
            <TouchableOpacity onPress={() => notInplement}>
              <Text style={[styles.amountText, styles.totalText]}>
                {currencyFormatter.format(result + (result * tax) / 100, {
                  code: 'USD',
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <View style={GlobalStyles.row}>
              <TouchableOpacity onPress={() => notInplement()}>
                <CustomIconsComponent
                  style={styles.historyIconStyle}
                  type={'MaterialIcons'}
                  color={Colors.grey}
                  size={25}
                  name={'history-toggle-off'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => notInplement()}>
                <CustomIconsComponent
                  style={styles.iconStyle}
                  type={'SimpleLineIcons'}
                  color={Colors.grey}
                  size={20}
                  name={'note'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.value}>
              {!isDouble
                ? currencyFormatter.format(currVal, {
                    code: 'USD',
                    precision: 0,
                  })
                : currencyFormatter.format(currVal, {
                    code: 'USD',
                  })}
            </Text>
          </View>
        </View>
        <View style={styles.calculatorContainer}>
          <View style={GlobalStyles.row}>
            <Button text="1" onPress={() => handleTap('number', 1)} />
            <Button text="2" onPress={() => handleTap('number', 2)} />
            <Button text="3" onPress={() => handleTap('number', 3)} />
            <Button
              iconType={'Ionicons'}
              iconName={'backspace-outline'}
              onPress={() => {
                currVal && onBackSpace();
              }}
            />
          </View>

          <View style={GlobalStyles.row}>
            <Button text="4" onPress={() => handleTap('number', 4)} />
            <Button text="5" onPress={() => handleTap('number', 5)} />
            <Button text="6" onPress={() => handleTap('number', 6)} />
            <Button
              text="C"
              theme="secondary"
              onPress={() => handleTap('onlyClear')}
            />
          </View>

          <View style={GlobalStyles.row}>
            <Button text="7" onPress={() => handleTap('number', 7)} />
            <Button text="8" onPress={() => handleTap('number', 8)} />
            <Button text="9" onPress={() => handleTap('number', 9)} />
            <Button
              text="AC"
              theme="secondary"
              onPress={() => {
                Alert.alert('', 'Do you really want to clear all?', [
                  {
                    text: 'yes',
                    onPress: () => {
                      handleTap('clear');
                    },
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ]);
              }}
            />
          </View>
          <View style={GlobalStyles.row}>
            <View style={styles.zeroRow}>
              <Button text="0" onPress={() => handleTap('number', 0)} />
            </View>
            <Button
              text="."
              theme="secondary"
              onPress={() => handleTap('double')}
            />
            <Button
              text="+"
              theme="accent"
              onPress={() =>
                currVal && currVal > 0 && handleTap('operator', '+')
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
    elevation: 2,
  },
  zeroRow: {width: screen.height / 4},
  value: {
    color: Colors.greyText,
    fontSize: 34,
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountHeaderText: {
    fontSize: 16,
    color: Colors.grey,
  },
  amountText: {
    fontSize: 18,
    color: Colors.grey,
    paddingTop: 10,
  },
  calculatorContainer: {
    justifyContent: 'flex-end',
    backgroundColor: '#EDEFF3',
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 3,
  },
  iconStyle: {
    paddingHorizontal: 6,
    paddingTop: 15,
  },
  historyIconStyle: {paddingTop: 13},
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  totalHeaderText: {fontWeight: 'bold'},
  totalText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
