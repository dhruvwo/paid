import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import CustomIconsComponent from '../components/CustomIcons';
import FastImage from 'react-native-fast-image';
import * as _ from 'lodash';
import currencyFormatter from 'currency-formatter';
import {cartAction} from '../store/actions';
import {currency} from '../constants/Default';

const screenHeight = Dimensions.get('window').height;

export default function ProductDetailModal(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });
  const cardProduct = cartState.cart.products;
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCartProduct, setIsCartProduct] = useState(false);

  useEffect(() => {
    fnIsCartProduct();
  }, []);

  useEffect(() => {
    setTotal(
      currencyFormatter.format(
        (qty * props.product.prices[0].unitAmountDecimal) / 100,
        {
          code: _.toUpper(currency),
        },
      ),
    );
  }, [qty]);
  const fnIsCartProduct = () => {
    const index = _.findIndex(cardProduct, {id: props.product.id});
    if (index > -1) {
      setQty(cardProduct[index].qty);
      setIsCartProduct(true);
    } else {
      setIsCartProduct(false);
    }
  };

  const onSubmit = async () => {
    const data = {
      id: props.product.id,
      product: props.product,
      qty: qty,
      priceId: props.product.prices[0].id,
      price: props.product.prices[0].unitAmountDecimal,
    };
    if (isCartProduct) {
      await dispatch(cartAction.updateCart(data));
    } else {
      await dispatch(cartAction.addProduct(data));
      setIsCartProduct(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            props.closeModal();
          }}>
          <CustomIconsComponent
            name={'chevron-back'}
            type={'Ionicons'}
            color={Colors.darkGrey}
            size={40}
          />
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>{props.product.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <View style={styles.productImageContainer}>
          <FastImage
            style={styles.productImage}
            resizeMode={'cover'}
            source={require('../assets/products/product2.jpg')}
          />
        </View>
        <View style={styles.productDetailContainer}>
          <View style={styles.productContainer}>
            <Text style={styles.productText}>{props.product.name}</Text>
            <Text style={styles.modalText}>{props.product.description}</Text>
          </View>

          <View style={styles.priceMainContainer}>
            <View style={styles.productContainer}>
              <Text style={styles.headerText}>Prices</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {currencyFormatter.format(
                    props.product.prices[0].unitAmountDecimal / 100,
                    {
                      code: _.toUpper(currency),
                    },
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.productContainer}>
              <Text style={styles.headerText}>Quantity</Text>
              <View style={[styles.qtyContainer]}>
                <TouchableOpacity
                  style={styles.qtyBtn('-')}
                  onPress={() => {
                    qty > 1 && setQty(qty - 1);
                  }}>
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                {/* <TextInput
            value={qty}
            placeholder="Quantity*"
            onChangeText={(qty) => setQty(qty)}
          /> */}
                <Text style={[styles.qtyText, styles.qtyTextStyle]}>{qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn('+')}
                  onPress={() => {
                    setQty(qty + 1);
                  }}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <View>
              <Text>Total:</Text>
              <Text style={styles.totalText}>{total}</Text>
            </View>
            <TouchableOpacity
              style={[GlobalStyles.secondaryButtonContainer, styles.totalBtn]}
              onPress={() => onSubmit()}>
              <Text style={GlobalStyles.secondaryButtonText}>
                {isCartProduct ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingTop: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  backBtn: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    position: 'absolute',
    left: 3,
  },
  modalHeaderText: {
    fontSize: 28,
    paddingVertical: 4,
    justifyContent: 'center',
    textAlign: 'center',
  },
  modalContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  productDetailContainer: {
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  modalText: {
    fontSize: 16,
    paddingVertical: 6,
  },
  productText: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  productImageContainer: {
    alignItems: 'center',
    margin: 10,
  },
  productImage: {
    height: 300,
    width: '100%',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 5,
    textAlign: 'center',
  },
  priceMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productContainer: {
    color: Colors.darkGrey,
  },
  priceText: {
    fontSize: 20,
  },
  qtyContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  qtyText: {
    fontSize: 28,
    paddingHorizontal: 6,
    width: 50,
    textAlign: 'center',
  },
  qtyTextStyle: {
    borderColor: Colors.greyText,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  qtyBtn: (txt) => ({
    borderTopLeftRadius: txt === '-' ? 10 : 0,
    borderBottomLeftRadius: txt === '-' ? 10 : 0,
    borderTopRightRadius: txt === '+' ? 10 : 0,
    borderBottomRightRadius: txt === '+' ? 10 : 0,
    borderWidth: 1,
    width: 40,
    borderColor: Colors.greyText,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  totalBtn: {width: '46%', margin: 6},
});
