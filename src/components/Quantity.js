import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View, TextInput} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import GlobalStyles from '../constants/GlobalStyles';
import {useSelector} from 'react-redux';
import * as _ from 'lodash';
import ToastService from '../services/Toast';

export default function QuantityComponent(props) {
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });
  const [qty, setQty] = useState(1);
  const delayedQuery = useCallback(
    _.debounce(() => updateInputQty(), 1500),
    [qty],
  );

  useEffect(() => {
    delayedQuery();
    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [qty, delayedQuery]);

  useEffect(() => {
    setQty(props.item.qty);
  }, [props.item]);

  const isProductInCart = () => {
    const index = _.findIndex(cartState.cart.products, {id: props.item.id});
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  };
  const showDelete =
    props.showDelete && !(props.item.qty > 1 || !isProductInCart());

  const updateInputQty = () => {
    if (parseInt(qty) > 0 && parseInt(qty) <= 2001) {
      props.item.qty = parseInt(qty);
    } else if (qty === '') {
      props.item.qty = 1;
      setQty(1);
    } else {
      setQty(1);
      ToastService({
        message: 'Please give vaild quantity.',
      });
    }
    props.getQuantity(props.item);
  };

  const updateOperatorQty = (val) => {
    if (val === '+' && qty < 2001) {
      props.item.qty = qty + 1;
      setQty(qty + 1);
    } else if (val === '-' && qty > 1) {
      props.item.qty = qty - 1;
      setQty(qty - 1);
    } else {
      ToastService({
        message: 'Please give vaild quantity.',
      });
    }
    props.getQuantity(props.item);
  };

  return (
    <View style={GlobalStyles.row}>
      <TouchableOpacity
        style={styles.qtyBtn('-')}
        onPress={() => {
          showDelete ? props.deleteProduct(props.item) : updateOperatorQty('-');
        }}>
        <CustomIconsComponent
          name={showDelete ? 'delete-outline' : 'minus'}
          size={22}
          type={showDelete ? 'MaterialCommunityIcons' : 'Entypo'}
          color={showDelete ? Colors.red : Colors.primary}
        />
      </TouchableOpacity>
      <TextInput
        style={[styles.qtyInput]}
        keyboardType={'numeric'}
        value={qty.toString()}
        onChangeText={(val) => setQty(val)}
      />
      <TouchableOpacity
        style={styles.qtyBtn('+')}
        onPress={() => {
          updateOperatorQty('+');
        }}>
        <CustomIconsComponent name={'add'} size={22} type={'MaterialIcons'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  qtyBtn: (txt) => ({
    backgroundColor: txt === '-' ? Colors.bgColor : '#ADE2C4',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    height: 33,
    width: 33,
  }),
  qtyInput: {
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    padding: 0,
    width: 65,
    height: 33,
    backgroundColor: Colors.lightGrey,
  },
});
