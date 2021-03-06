import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import GlobalStyles from '../constants/GlobalStyles';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import ToastService from '../services/Toast';
import {cartAction} from '../store/actions';

export default function QuantityComponent(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => cart);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const index = _.findIndex(cartState.items, {id: props.item.id});
    if (index > -1) {
      setQty(cartState?.items[index]?.qty);
    }
  }, [cartState.items]);

  const isProductInCart = () => {
    const index = _.findIndex(cartState.items, {id: props.item.id});
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  };

  const updateOperatorQty = (val) => {
    let qtyUpdate = 1;
    if (val === '+' && qty < 2001) {
      qtyUpdate = qty === '' ? 1 : parseInt(qty) + 1;
    } else if (val === '-' && (qty > 1 || qty === '')) {
      qtyUpdate = qty === '' ? 1 : parseInt(qty) - 1;
    } else {
      ToastService({
        message: 'Please give vaild quantity.',
      });
    }
    props.item['qty'] = qtyUpdate;
    props.getQuantity(props.item);
    if (isProductInCart()) {
      dispatch(cartAction.updateItem(props.item));
    } else {
      setQty(qtyUpdate);
    }
  };

  return (
    <View style={GlobalStyles.row}>
      <TouchableOpacity
        // disabled={qty < 2}
        style={[
          styles.qtyBtn('-'),
          qty < 2 ? GlobalStyles.buttonDisabledContainer : '',
        ]}
        onPress={() => qty > 1 && updateOperatorQty('-')}>
        <CustomIconsComponent
          name={'minus'}
          size={22}
          type={'Entypo'}
          color={Colors.darkGrey}
        />
      </TouchableOpacity>
      <Text style={[styles.qtyInput]}>{qty}</Text>
      <TouchableOpacity
        style={styles.qtyBtn('+')}
        onPress={() => {
          updateOperatorQty('+');
        }}>
        <CustomIconsComponent
          name={'add'}
          size={22}
          type={'MaterialIcons'}
          color={Colors.darkGrey}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  qtyBtn: (txt) => ({
    backgroundColor: txt === '-' ? '#fcece9' : '#d5f2e1',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    height: 33,
    width: 33,
  }),
  qtyInput: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    alignItems: 'center',
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: 55,
    height: 33,
    color: Colors.primary,
    // backgroundColor: '#fafafa',
    paddingTop: 6,
  },
});
