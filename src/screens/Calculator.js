import React, {useState} from 'react';
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
import Default from '../constants/Default';
import Note from '../components/calculator/Note';
import History from '../components/calculator/History';
import {cartAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';

const screen = Dimensions.get('window');

export default function CalculatorScreen(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });
  const [currVal, setCurrVal] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');

  const addCart = async (current) => {
    const data = {
      id: 'quickPay' + cartState?.cart?.quickPay?.length,
      product: {type: 'quick Pay', note: note},
      price: current * 100,
      qty: 1,
    };
    await dispatch(cartAction.addQuickPay(data));
    setCurrVal(0);
    setNote('');
  };

  const fnClearAll = async () => {
    setCurrVal(0);
    setNote('');
    await dispatch(cartAction.clearQuickPay());
  };

  const handleTap = (type, value) => {
    switch (type) {
      case 'number':
        if (parseFloat(currVal) === 0) {
          setCurrVal(`${value}`);
        } else if (
          getPrecision() !== 2 &&
          parseFloat(`${currVal}${value}`) <= 999999.99
        ) {
          setCurrVal(`${currVal}${value}`);
        }
        break;
      case 'operator':
        addCart(parseFloat(currVal));
        break;
      case 'onlyClear':
        setCurrVal(0);
        setNote('');
        break;
      case 'clear':
        fnClearAll();
        break;
      case 'double':
        if (!currVal.toString().includes('.')) {
          setCurrVal(`${currVal}${'.'}`);
        }
        break;
    }
  };

  const onBackSpace = () => {
    let val = _.cloneDeep(currVal);
    let newVal = val ? val.slice(0, -1) : 0;
    setCurrVal(newVal || 0);
  };

  const getResult = () => {
    let add = 0;
    cartState.cart.quickPay.map((val, i) => {
      add += val.price;
    });
    return add;
  };

  function getPrecision() {
    if (currVal && currVal.toString().includes('.')) {
      return currVal.toString().split('.')[1].length;
    }
    return 0;
  }

  function showDot() {
    const pres = getPrecision();
    if (pres === 0 && currVal && currVal.toString().includes('.')) {
      return '.';
    }
    return '';
  }

  return (
    <SafeAreaView style={GlobalStyles.flexStyle}>
      <Header
        navigation={props.navigation}
        title={'Quick Pay'}
        showMenu={true}
        showCart={'Calculator'}
      />
      <View style={GlobalStyles.flexStyle}>
        <View style={[GlobalStyles.row, styles.container]}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountHeaderText}>Amount</Text>
            <Text style={styles.amountText}>
              {currencyFormatter.format(getResult() / 100, {
                code: _.toUpper(Default.currency),
              })}
            </Text>
          </View>
          <View style={[styles.amountContainer]}>
            <Text style={styles.amountHeaderText}>Tax ({Default.taxName})</Text>
            <Text style={styles.amountText}>{Default.tax * 100}%</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amountHeaderText, styles.totalHeaderText]}>
              Total
            </Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Checkout', 'Calculator')
              }>
              <Text style={[styles.amountText, styles.totalText]}>
                {currencyFormatter.format(
                  (getResult() + getResult() * Default.tax) / 100,
                  {
                    code: _.toUpper(Default.currency),
                  },
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              // disabled={!cartState?.cart?.quickPay?.length}
              onPress={() => {
                setShowHistoryModal(true);
              }}>
              <CustomIconsComponent
                style={styles.historyIconStyle}
                type={'MaterialIcons'}
                color={
                  cartState?.cart?.quickPay?.length
                    ? Colors.primary
                    : Colors.grey
                }
                size={25}
                name={'history-toggle-off'}
              />
            </TouchableOpacity>
            <View style={[GlobalStyles.row, styles.noteContainer]}>
              {note ? (
                <TouchableOpacity
                  style={GlobalStyles.row}
                  onPress={() => {
                    setShowNoteModal(true);
                  }}>
                  <Text
                    style={styles.noteTextStyle}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {note}
                  </Text>
                  <CustomIconsComponent
                    style={styles.iconStyle}
                    type={'SimpleLineIcons'}
                    color={Colors.primary}
                    size={20}
                    name={'note'}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setShowNoteModal(true);
                  }}>
                  <CustomIconsComponent
                    style={styles.iconStyle}
                    type={'SimpleLineIcons'}
                    color={Colors.grey}
                    size={20}
                    name={'note'}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.inputText}>
              {currencyFormatter.format(currVal, {
                code: _.toUpper(Default.currency),
                precision: getPrecision(),
              })}
              {showDot()}
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
            <Button text="0" onPress={() => handleTap('number', 0)} />
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
      </View>
      <History
        visible={showHistoryModal}
        closeModal={() => {
          setShowHistoryModal(false);
        }}
      />
      <Note
        note={note}
        visible={showNoteModal}
        closeModal={(val) => {
          setNote(val);
          setShowNoteModal(false);
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-around',
    margin: 10,
    borderRadius: 20,
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  inputText: {
    color: Colors.greyText,
    fontSize: 34,
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
  noteTextStyle: {
    fontSize: 16,
    paddingTop: 13,
    paddingLeft: 5,
  },
  noteContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 30,
  },
});
