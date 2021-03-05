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
  const cartState = useSelector(({cart}) => cart);
  const [qty, setQty] = useState(1);
  const [isCartProduct, setIsCartProduct] = useState(false);
  let data = {
    id: props?.product?.id,
    product: props?.product,
    qty: qty,
    priceId: !_.isEmpty(props.product) ? props.product.prices[0].id : 0,
    price: !_.isEmpty(props.product)
      ? props.product.prices[0].unitAmountDecimal
      : 0,
  };

  useEffect(() => {
    const index = _.findIndex(cartState.items, {id: props?.product?.id});
    if (index > -1) {
      data['qty'] = cartState?.items[index]?.qty;
      setQty(cartState?.items[index]?.qty);
      setIsCartProduct(true);
    } else {
      setIsCartProduct(false);
    }
  }, [props.product, cartState.items]);

  const updateQty = (item) => {
    setQty(item.qty);
  };

  const removeProduct = () => {
    Alert.alert('', 'Do you want to remove product from cart?', [
      {
        text: 'Remove',
        onPress: () => {
          dispatch(cartAction.removeItem(props?.product?.id));
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
      props.navigation.navigate('Checkout');
      props.closeModal();
    } else {
      await dispatch(cartAction.addItem(data));
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
      <SafeAreaView style={GlobalStyles.flexStyle}>
        <View style={styles.mainContainer}>
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
                source={require('../assets/products/product7.png')}
              />
            </View>
            <View style={styles.productDetailContainer}>
              <Text style={styles.productText}>{props?.product?.name}</Text>
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
              <View style={styles.detailsContainer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.fieldTitleText}>Total:</Text>
                  <View style={styles.fieldValueText}>
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
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.fieldTitleText}>Quantity:</Text>
                  <View style={styles.fieldValueText}>
                    <QuantityComponent
                      item={data}
                      getQuantity={(data) => updateQty(data)}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.descriptionText}>
                {props?.product?.description}
              </Text>
            </View>
            <View style={GlobalStyles.row}>
              <TouchableOpacity
                style={[GlobalStyles.secondaryButtonContainer, styles.btnStyle]}
                onPress={() => onSubmit()}>
                <Text style={GlobalStyles.secondaryButtonText}>
                  {isCartProduct ? 'Go to cart' : 'Add to cart'}
                </Text>
              </TouchableOpacity>
              {isCartProduct && (
                <TouchableOpacity
                  style={[
                    GlobalStyles.secondaryButtonContainer,
                    isCartProduct ? '' : GlobalStyles.buttonDisabledContainer,
                    styles.btnStyle,
                    styles.deleteButtonStyle,
                  ]}
                  disabled={!isCartProduct}
                  onPress={() => removeProduct()}>
                  <Text style={GlobalStyles.secondaryButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    flex: 1,
  },
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
    padding: 20,
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
    // paddingTop: 5,
  },
  fieldValueText: {
    marginTop: 5,
  },
  fieldTitleText: {
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 5,
  },
  priceText: {
    fontSize: 22,
    paddingVertical: 5,
    color: Colors.primary,
    fontWeight: '700',
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
    fontSize: 18,
    lineHeight: 30,
  },
  totalBtn: {
    flex: 1,
    borderRadius: 20,
  },
  btnStyle: {
    flex: 1,
    borderRadius: 0,
    height: 42,
  },
  deleteButtonStyle: {
    backgroundColor: '#e55c5c',
  },
});
