import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import FastImage from 'react-native-fast-image';
import * as _ from 'lodash';
import currencyFormatter from 'currency-formatter';
import {cartAction} from '../store/actions';
import Default from '../constants/Default';
import CustomIconsComponent from '../components/CustomIcons';
import QuantityComponent from '../components/Quantity';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function ProductDetailModal(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });
  const cardProduct = cartState.cart.products;
  const [qty, setQty] = useState(1);
  const [isCartProduct, setIsCartProduct] = useState(false);

  useEffect(() => {
    fnIsCartProduct();
  }, [props.product]);

  const fnIsCartProduct = () => {
    const index = _.findIndex(cardProduct, {id: props?.product?.id});
    if (index > -1) {
      setQty(cardProduct[index].qty);
      setIsCartProduct(true);
    } else {
      setQty(1);
      setIsCartProduct(false);
    }
  };

  const data = {
    id: props?.product?.id,
    product: props?.product,
    qty: qty,
    priceId: !_.isEmpty(props.product) ? props.product.prices[0].id : 0,
    price: !_.isEmpty(props.product)
      ? props.product.prices[0].unitAmountDecimal
      : 0,
  };

  const updateQty = (item) => {
    setQty(item.qty);
  };

  const removeProduct = (item) => {
    Alert.alert('', 'Do you really want to remove product from cart?', [
      {
        text: 'yes',
        onPress: () => {
          dispatch(cartAction.removeProduct(item.id));
          setIsCartProduct(false);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const onSubmit = async () => {
    if (isCartProduct) {
      await dispatch(cartAction.updateCart(data));
    } else {
      await dispatch(cartAction.addProduct(data));
      setIsCartProduct(true);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => {
        props.closeModal();
      }}>
      <View style={GlobalStyles.flexStyle}>
        <TouchableOpacity
          style={styles.headerIconContainer}
          onPress={() => {
            props.closeModal();
          }}>
          <CustomIconsComponent
            type={'Ionicons'}
            name={'chevron-back'}
            color={Colors.greyText}
            size={40}
          />
        </TouchableOpacity>

        <KeyboardAwareScrollView
          style={GlobalStyles.flexStyle}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <View style={styles.productImageContainer}>
            <FastImage
              style={styles.productImage}
              resizeMode={'contain'}
              source={require('../assets/products/product6.png')}
            />
          </View>
          <View style={styles.productDetailContainer}>
            <Text style={styles.productText}>{props?.product?.name}</Text>
            <Text style={styles.descriptionText}>
              {props?.product?.description}
            </Text>
            <View style={styles.detailsContainer}>
              <View style={styles.priceContainer}>
                <Text style={styles.fieldTitleText}>Price</Text>
                <View style={styles.fieldValueText}>
                  <Text style={styles.priceText}>
                    {currencyFormatter.format(
                      (!_.isEmpty(props.product)
                        ? props?.product?.prices[0]?.unitAmountDecimal
                        : 0) / 100,
                      {
                        code: _.toUpper(Default.currency),
                      },
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.fieldTitleText}>Quantity</Text>
                <View style={styles.fieldValueText}>
                  <QuantityComponent
                    showDelete={true}
                    item={data}
                    deleteProduct={(id) => removeProduct(id)}
                    getQuantity={(data) => updateQty(data)}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.totalContainer}>
          <View style={GlobalStyles.flexStyle}>
            <Text style={styles.totalText}>
              {currencyFormatter.format(
                (qty *
                  (!_.isEmpty(props.product)
                    ? props?.product?.prices[0]?.unitAmountDecimal
                    : 0)) /
                  100,
                {
                  code: _.toUpper(Default.currency),
                },
              )}
            </Text>
          </View>
          <TouchableOpacity
            style={[GlobalStyles.buttonContainer, styles.totalBtn]}
            onPress={() => onSubmit()}>
            <Text style={GlobalStyles.buttonText}>
              {isCartProduct ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
  },
  headerIconContainer: {
    position: 'absolute',
    top: 5,
    left: 2,
    zIndex: 1,
  },
  productDetailContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    // borderTopLeftRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.bgColor,
    padding: 25,
  },
  productImageContainer: {
    alignItems: 'center',
  },
  productImage: {
    height: 360,
    width: '100%',
    margin: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.greyText,
    paddingVertical: 6,
  },
  productText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  priceContainer: {
    paddingTop: 5,
  },
  fieldValueText: {
    marginTop: 5,
  },
  fieldTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  priceText: {
    fontSize: 18,
    lineHeight: 18,
  },
  totalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15,
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    opacity: 0.9,
    // borderTopLeftRadius: 25,
  },
  totalText: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    paddingVertical: 10,
  },
  totalBtn: {
    flex: 1,
    borderRadius: 20,
  },
});
