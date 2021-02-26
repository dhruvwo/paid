import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomIconsComponent from '../CustomIcons';
import GlobalStyles from '../../constants/GlobalStyles';
import currencyFormatter from 'currency-formatter';
import Default from '../../constants/Default';
import {cartAction} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import Header from '../Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function History(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });

  const [isEditable, setIsEditable] = useState(false);
  const [newValue, setNewValue] = useState('');

  const updateCart = async (item) => {
    setIsEditable(false);
    const data = {
      id: item.id,
      product: item.product,
      price: parseFloat(newValue) * 100,
    };
    setNewValue('');
    console.log('data', data);
    await dispatch(cartAction.updateCart(data));
  };

  const update = (item) => {
    // setIsEditable(item.id);
    // setNewValue(item.price);
    return Alert.alert(``, `Comming soon.`, [
      {
        text: 'Close',
        style: 'cancel',
      },
    ]);
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => {
        props.closeModal();
      }}>
      <Header
        navigation={props.navigation}
        title="History"
        close={() => props.closeModal()}
      />
      <KeyboardAwareScrollView
        style={GlobalStyles.flexStyle}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {cartState.cart.quickPay.length ? (
          cartState.cart.quickPay.map((val, i) => {
            return (
              <View style={styles.titleIconContainer} key={val.id}>
                {isEditable && isEditable === val.id ? (
                  <>
                    <TouchableOpacity
                      onPress={() => newValue > 0 && updateCart(val)}>
                      <CustomIconsComponent
                        name={'checkmark'}
                        type={'Ionicons'}
                      />
                    </TouchableOpacity>
                    <View style={GlobalStyles.row}>
                      <TextInput
                        style={styles.inputStyle}
                        keyboardType={'numeric'}
                        value={(newValue / 100).toString()}
                        onChangeText={(val) => {
                          console.log('parseFloat', parseFloat(val));
                          // if (parseFloat(val) <= 999999.99 && parseFloat > 0) {
                          setNewValue(val);
                          // }
                        }}
                      />
                      <Text style={styles.productPrice}>
                        {`${
                          ` + ` +
                          currencyFormatter.format(
                            (newValue / 100) * Default.tax,
                            {
                              code: _.toUpper(Default.currency),
                            },
                          ) +
                          ` = ` +
                          currencyFormatter.format(
                            newValue / 100 + (newValue / 100) * Default.tax,
                            {
                              code: _.toUpper(Default.currency),
                            },
                          )
                        }`}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <TouchableOpacity onPress={() => update(val)}>
                      <CustomIconsComponent name={'edit'} type={'AntDesign'} />
                    </TouchableOpacity>
                    <Text style={styles.productPrice}>
                      {`${
                        currencyFormatter.format(val.price / 100, {
                          code: _.toUpper(Default.currency),
                        }) +
                        ` + ` +
                        currencyFormatter.format(
                          (val.price / 100) * Default.tax,
                          {
                            code: _.toUpper(Default.currency),
                          },
                        ) +
                        ` = ` +
                        currencyFormatter.format(
                          val.price / 100 + (val.price / 100) * Default.tax,
                          {
                            code: _.toUpper(Default.currency),
                          },
                        )
                      }`}
                    </Text>
                  </>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataFound}>No payment yet!</Text>
        )}
      </KeyboardAwareScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
  },
  titleIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginBottom: 0,
    backgroundColor: Colors.white,
    padding: 10,
  },
  productPrice: {
    fontSize: 18,
  },
  noDataFound: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 20,
  },
  inputStyle: {
    // flexGrow: 1,
    // flexShrink: 1,
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    margin: 0,
    padding: 0,
    minWidth: 100,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
