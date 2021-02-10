import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import Header from '../components/Header';
import Button from '../components/calculator/Button';
import * as _ from 'lodash';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import currencyFormatter from 'currency-formatter';

export default function CalculatorScreen(props) {
  const [currVal, setCurrVal] = useState(0);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(0);
  const tax = '3';

  const handleTap = (type, value) => {
    if (type === 'number') {
      setCurrVal(`${currVal}${value}`);
    }

    if (type === 'operator') {
      // setOperator(value);
      let historyArr = _.cloneDeep(history);
      const current = parseFloat(currVal);
      console.log('current = ', current);
      historyArr.push(current);
      setHistory(historyArr);
    }

    if (type === 'clear') {
      setCurrVal(0);
      // setOperator(null);
      // setPrevVal(null);
      setHistory([]);
      setResult(0);
    }

    console.log('value : ', value);
  };

  const onBackSpace = () => {
    let val = _.cloneDeep(currVal);
    let newVal = val.slice(0, -1);
    // newVal = _.toString(newVal);
    setCurrVal(newVal);

    // setHistory(newVal);
    // setResult(newVal);
  };

  useEffect(() => {
    if (history.length) {
      // const current = parseFloat(currVal);
      console.log('history --> ', history);
      var sum = history.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
      console.log('total --> ', sum);
      setResult(sum);
      // setPrevVal(current);
      setCurrVal(0);
    }
  }, [history]);

  return (
    <SafeAreaView style={GlobalStyles.mainView}>
      <Header navigation={props.navigation} result={result} />
      <View style={styles.container}>
        <View style={styles.answerStyles}>
          <Text style={[styles.value, {color: Colors.primary}]}>
            Charge{' '}
            {currencyFormatter.format(result + (result * tax) / 100, {
              code: 'USD',
            })}
          </Text>
          <Text style={[styles.value, styles.taxText]}>Including Tax</Text>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.noteStyle}>
            <CustomIconsComponent
              style={styles.iconStyle}
              type={'SimpleLineIcons'}
              color={Colors.grey}
              size={20}
              name={'note'}
            />
            <Text style={styles.noteText}>Note</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.value}>
              {currencyFormatter.format(currVal, {
                code: 'USD',
              })}
            </Text>
            <TouchableOpacity
              style={styles.noteStyle}
              onPress={() => {
                currVal && onBackSpace();
              }}>
              <CustomIconsComponent
                style={styles.iconStyle}
                type={'Ionicons'}
                color={Colors.grey}
                name={'backspace-outline'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.calculatorContainer}>
          <View style={styles.row}>
            <Button text="1" onPress={() => handleTap('number', 1)} />
            <Button text="2" onPress={() => handleTap('number', 2)} />
            <Button text="3" onPress={() => handleTap('number', 3)} />
          </View>

          <View style={styles.row}>
            <Button text="4" onPress={() => handleTap('number', 4)} />
            <Button text="5" onPress={() => handleTap('number', 5)} />
            <Button text="6" onPress={() => handleTap('number', 6)} />
          </View>

          <View style={styles.row}>
            <Button text="7" onPress={() => handleTap('number', 7)} />
            <Button text="8" onPress={() => handleTap('number', 8)} />
            <Button text="9" onPress={() => handleTap('number', 9)} />
          </View>
          <View style={styles.row}>
            <Button
              text="C"
              theme="secondary"
              onPress={() => handleTap('clear')}
            />
            <Button text="0" onPress={() => handleTap('number', 0)} />
            <Button
              text="+"
              theme="accent"
              onPress={() => handleTap('operator', '+')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    // backgroundColor: '#9BCCAF',
    backgroundColor: Colors.white,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  value: {
    color: Colors.greyText,
    fontSize: 34,
    textAlign: 'center',
  },
  answerStyles: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    borderRadius: 10,
    paddingVertical: 8,
    marginVertical: 20,
    width: '95%',
    alignSelf: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    color: Colors.primary,
    flexGrow: 1,
    maxHeight: 80,
    justifyContent: 'center',
  },
  calculatorContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  iconStyle: {
    paddingHorizontal: 4,
  },
  noteStyle: {padding: 12, flexDirection: 'row'},
  inputContainer: {
    flexDirection: 'row',
    maxHeight: 60,
    justifyContent: 'space-between',
    margin: 10,
    marginHorizontal: 10,
  },
  noteText: {color: Colors.greyText, fontSize: 14, paddingVertical: 2},
  taxText: {color: Colors.primary, fontSize: 12},
});
