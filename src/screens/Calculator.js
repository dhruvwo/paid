import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
  Platform,
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
  const cartState = useSelector(({cart, auth}) => ({
    cart,
    auth,
  }));
  const [currVal, setCurrVal] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');

  const addCart = async (current) => {
    const data = {
      id: 'quickPay' + cartState?.cart?.items?.length,
      product: {type: 'quick Pay', note: note},
      price: current * 100,
      qty: 1,
    };
    await dispatch(cartAction.addItem(data));
    setCurrVal(0);
    setNote('');
  };

  const fnClearAll = async () => {
    setCurrVal(0);
    setNote('');
    await dispatch(cartAction.clearItems('onlyCalc'));
  };

  const handleTap = (type, value) => {
    switch (type) {
      case 'number':
        if (parseFloat(currVal) === 0) {
          if (currVal && currVal.includes('.')) {
            setCurrVal(`${currVal}${value}`);
          } else {
            setCurrVal(`${value}`);
          }
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
    cartState.cart.items.forEach((val) => {
      if (!val.priceId) {
        add += val.price;
      }
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

  const calItemsOnly = cartState.cart.items.filter((o) => {
    return !o.priceId;
  });

  return (
    <SafeAreaView style={GlobalStyles.flexStyle}>
      <Header
        navigation={props.navigation}
        title={'Quick Pay'}
        showMenu={true}
        showCheckout={true}
      />
      <View style={GlobalStyles.flexStyle}>
        <ImageBackground
          source={require('../assets/bg.png')}
          style={styles.container}
          resizeMode={'cover'}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountHeaderText}>Amount</Text>
            <Text style={styles.amountText}>
              {currencyFormatter.format(getResult() / 100, {
                code: _.toUpper(Default.currency),
              })}
            </Text>
          </View>
          <View style={[styles.amountContainer]}>
            <Text style={styles.amountHeaderText}>
              {cartState?.auth?.tax?.display_name
                ? `Tax (${cartState.auth.tax.display_name})`
                : 'Tax'}
            </Text>
            <Text style={styles.amountText}>
              {cartState?.auth?.tax?.percentage
                ? cartState?.auth?.tax?.percentage
                : 0}
              %
            </Text>
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
                  cartState?.auth?.tax?.percentage
                    ? (getResult() / 100) *
                        ((100 + cartState?.auth?.tax?.percentage) / 100)
                    : getResult() / 100,
                  {
                    code: _.toUpper(Default.currency),
                  },
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            // disabled={!cartState?.cart?.items?.length}
            onPress={() => {
              setShowHistoryModal(true);
            }}>
            <CustomIconsComponent
              style={styles.historyIconStyle}
              type={'MaterialIcons'}
              color={calItemsOnly.length ? Colors.primary : Colors.grey}
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
            <View style={styles.footerBottonContainer}>
              <View style={GlobalStyles.row}>
                <Button text="7" onPress={() => handleTap('number', 7)} />
                <Button text="8" onPress={() => handleTap('number', 8)} />
                <Button text="9" onPress={() => handleTap('number', 9)} />
              </View>
              <View style={GlobalStyles.row}>
                <Button
                  text="."
                  theme="secondary"
                  onPress={() => handleTap('double')}
                />
                <Button text="0" onPress={() => handleTap('number', 0)} />
              </View>
            </View>
            <View style={styles.clearContainer}>
              <Button
                text="AC"
                theme="secondary"
                onPress={() => {
                  cartState?.cart?.items?.length
                    ? Alert.alert('', 'Do you want to clear all?', [
                        {
                          text: 'Clear',
                          onPress: () => {
                            handleTap('clear');
                          },
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                      ])
                    : handleTap('onlyClear');
                }}
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={[GlobalStyles.secondaryButtonContainer, styles.addButton]}
              onPress={() =>
                currVal && currVal > 0 && handleTap('operator', '+')
              }>
              <CustomIconsComponent
                type={'MaterialIcons'}
                name={'add'}
                color={Colors.white}
                size={28}
              />
            </TouchableOpacity>
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
    flexDirection: 'row',
    // backgroundColor: 'rgba(0, 0, 0, 1)',
    // marginVertical: 6,
    justifyContent: 'space-around',
    // elevation: 8,
    // shadowOffset: {
    //   width: 2,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 2.62,
  },
  imageContainer: {
    width: '100%',
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
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 16,
    color: Colors.white,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  calculatorContainer: {
    justifyContent: 'flex-end',
    backgroundColor: '#EDEFF3',
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
    padding: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    margin: 3,
  },
  iconStyle: {
    paddingHorizontal: 6,
  },
  historyIconStyle: {},
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  totalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  noteTextStyle: {
    fontSize: 16,
    paddingLeft: 5,
  },
  noteContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 60,
  },
  footerBottonContainer: {flexGrow: 1},
  clearContainer: {width: screen.width / 4},
  addButton: {
    alignItems: 'center',
    margin: 4,
    borderRadius: 10,
    paddingVertical: 12,
  },
});
