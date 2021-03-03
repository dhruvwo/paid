import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {cartAction, invoiceAction} from '../store/actions';
import Header from '../components/Header';
import CustomersList from '../components/customer/CustomersList';
import * as _ from 'lodash';
import currencyFormatter from 'currency-formatter';
import CustomIconsComponent from '../components/CustomIcons';
import FastImage from 'react-native-fast-image';
import ProductDetailModal from '../components/ProductDetail';
import Default from '../constants/Default';
import moment from 'moment';
import ToastService from '../services/Toast';
import QuantityComponent from '../components/Quantity';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

export default function Checkout(props) {
  const dispatch = useDispatch();
  const reducState = useSelector(({auth, cart}) => ({
    auth,
    cart,
  }));

  const stripeDetails = reducState?.auth?.userSetup?.payments?.stripeDetails;
  const data = reducState.cart.items;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPay, setIsLoadingPay] = useState(false);
  const [customer, setCustomer] = useState({});
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [error, setError] = useState('Please select customer');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const sendInvoice = async () => {
    setIsLoading(true);
    let data = {
      accountId: stripeDetails.accountId,
      companyId: stripeDetails.companyId,
      amount: reducState?.auth?.tax?.percentage
        ? (getTotal() / 100) * ((100 + reducState.auth.tax.percentage) / 100)
        : getTotal() / 100,
      email: customer.email,
      customer: customer.customerId,
      subTotal: getTotal(),
      productItemsArray: getProductItemsArray(),
      currency: Default.currency,
      due_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      terms: 'due',
    };
    if (reducState?.auth?.tax?.id) {
      data['default_tax_rates'] = [reducState?.auth?.tax?.id];
    }
    const invoice = await dispatch(invoiceAction.sendInvoice(data));
    if (invoice.status === 'success') {
      setIsLoading(false);
      dispatch(cartAction.clearItems());
      props.navigation.navigate('Products');
      ToastService({
        message: 'Invoice sent successfully.',
      });
    } else {
      ToastService({
        message: invoice.data.message,
      });
      setError(invoice.data.message);
      setIsLoading(false);
    }
  };

  const sendQuickPayInvoice = async () => {
    setIsLoadingPay(true);
    const data = {
      accountId: stripeDetails.accountId,
      companyId: stripeDetails.companyId,
      amount: reducState?.auth?.tax?.percentage
        ? (getTotal() / 100) * ((100 + reducState.auth.tax.percentage) / 100)
        : getTotal() / 100,
      email: customer.email,
      customer: customer.customerId,
      currency: Default.currency,
      paymentMethod: customer.paymentMethod.id,
    };
    const pay = await dispatch(invoiceAction.sendQuickPayInvoice(data));
    if (pay.status === 'success') {
      setIsLoadingPay(false);
      dispatch(cartAction.clearItems());
      props.navigation.navigate(
        props.route.params === 'Product' ? 'Products' : 'QuickPay',
      );
      ToastService({
        message: 'Paid successfully.',
      });
    } else {
      setError(pay.data.message);
      ToastService({
        message: pay.data.message,
      });
      setIsLoadingPay(false);
    }
  };

  const getProductItemsArray = () => {
    let arry = [];
    data.map((val, i) => {
      arry.push({price: val.priceId, quantity: val.qty});
    });
    return arry;
  };

  const getCustomer = (customer) => {
    if (customer) {
      setCustomer(customer);
      if (!customer?.paymentMethod?.id) {
        setError('To enable quick pay, fill you cart details.');
      } else {
        setError('');
      }
    }
    setShowCustomerModal(false);
  };

  const getTotal = () => {
    let add = 0;
    data.map((val, i) => {
      add += val.price * val.qty;
    });
    return add;
  };

  const updateCart = (item) => {
    dispatch(cartAction.updateItem(item));
  };

  const deleteProduct = (id) => {
    Alert.alert('', `Do you want to remove this item from cart?`, [
      {
        text: 'Remove',
        onPress: () => {
          dispatch(cartAction.removeItem(id));
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const renderProductItem = (item, index) => {
    return (
      <TouchableOpacity
        disabled={!item.priceId}
        style={styles.productContainer}
        key={item.id}
        onPress={() => {
          setShowProductDetailModal(true);
          setSelectedProduct(item.product);
        }}>
        {item.priceId && (
          <FastImage
            style={styles.productImage}
            resizeMode={'cover'}
            source={require('../assets/products/product7.png')}
          />
        )}
        <View style={[styles.productDetailContainer]}>
          {item.priceId && (
            <Text style={styles.productName}>{item.product.name}</Text>
          )}
          <Text style={styles.productPrice}>
            {currencyFormatter.format((item.price / 100) * item.qty, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
          {item.priceId && (
            <QuantityComponent
              item={item}
              deleteProduct={(id) => deleteProduct(id)}
              getQuantity={(data) => updateCart(data)}
            />
          )}
          {item.product.note ? (
            <Text style={styles.productPrice}>{item.product.note}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => deleteProduct(item.id)}>
          <CustomIconsComponent
            name={'delete-outline'}
            type={'MaterialCommunityIcons'}
            color={Colors.red}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={GlobalStyles.footerText}>Cart is empty.</Text>
        <TouchableOpacity
          style={[
            GlobalStyles.secondaryButtonContainer,
            styles.goToButtonContainer,
          ]}
          onPress={() => {
            const navPage =
              props.route.params === 'Product' ? 'Products' : 'QuickPay';
            props.navigation.navigate(navPage);
          }}>
          <Text style={GlobalStyles.secondaryButtonText}>
            {props.route.params === 'Product'
              ? 'Go to product'
              : 'Go to quick pay'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity onPress={() => setShowCustomerModal(true)}>
        {_.isEmpty(customer) ? (
          <View style={styles.customerSelectContainer}>
            <Text style={styles.customerText}>Select Customer</Text>
            <Text style={[styles.customerText, {color: Colors.red}]}>*</Text>
          </View>
        ) : (
          <View style={styles.customerContainer}>
            <View>
              <Text style={styles.selectCustomerText(!_.isEmpty(customer))}>
                {customer.metadata &&
                  `${
                    customer?.metadata?.first_name +
                    `` +
                    customer?.metadata?.last_name +
                    (customer?.metadata?.business_name
                      ? ` (` + customer?.metadata?.business_name + `) `
                      : '')
                  }`}
              </Text>
              <Text
                style={[
                  styles.selectCustomerText(!_.isEmpty(customer)),
                  styles.emailText,
                ]}>
                {customer?.email}
              </Text>
            </View>
            <Text style={styles.changeText}>CHANGE</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const isOnlyProduct = () => {
    let isProduct = true;
    data.forEach((o) => {
      if (!o.priceId && isProduct) {
        isProduct = false;
      }
    });
    return !isProduct;
  };

  const renderFooter = () => {
    return (
      <>
        {!isKeyboardVisible && (
          <View style={styles.priceContainer}>
            <View style={styles.priceDetailContainer}>
              <Text style={styles.titleText}>Total MRP</Text>
              <Text style={styles.priceText}>
                {currencyFormatter.format(getTotal() / 100, {
                  code: _.toUpper(Default.currency),
                })}
              </Text>
            </View>
            <View style={styles.priceDetailContainer}>
              <Text style={styles.titleText}>
                Tax (
                {reducState?.auth?.tax?.percentage
                  ? reducState?.auth?.tax?.percentage
                  : 0}
                % {reducState?.auth?.tax?.display_name})
              </Text>
              <Text style={styles.priceText}>
                {currencyFormatter.format(
                  ((getTotal() / 100) * reducState?.auth?.tax?.percentage) /
                    100,
                  {
                    code: _.toUpper(Default.currency),
                  },
                )}
              </Text>
            </View>
            <View style={[styles.priceDetailContainer, styles.totalContainer]}>
              <Text style={styles.totalText}>Total Amount </Text>
              <Text style={styles.totalText}>
                {currencyFormatter.format(
                  reducState?.auth?.tax?.percentage
                    ? (getTotal() / 100) *
                        ((100 + reducState?.auth?.tax?.percentage) / 100)
                    : getTotal() / 100,
                  {
                    code: _.toUpper(Default.currency),
                  },
                )}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.buttonContainer}>
          {!!error && <Text style={styles.errorMessage}>{error}</Text>}
          <View style={GlobalStyles.row}>
            {!isOnlyProduct() && (
              <TouchableOpacity
                style={[
                  GlobalStyles.secondaryButtonContainer,
                  !_.isEmpty(customer)
                    ? ''
                    : GlobalStyles.buttonDisabledContainer,
                  styles.btnStyle,
                  styles.invoiceButtonStyle,
                ]}
                disabled={isLoadingPay || isLoading || _.isEmpty(customer)}
                onPress={() => !_.isEmpty(customer) && sendInvoice()}>
                {isLoading ? (
                  <ActivityIndicator
                    color={Colors.white}
                    size={25}
                    style={styles.loaderIcon}
                  />
                ) : (
                  <Text
                    style={[
                      GlobalStyles.secondaryButtonText,
                      !_.isEmpty(customer) ? '' : styles.btnTextStyle,
                    ]}>
                    Send Invoice
                  </Text>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                GlobalStyles.secondaryButtonContainer,
                !_.isEmpty(customer) && customer.paymentMethod
                  ? ''
                  : GlobalStyles.buttonDisabledContainer,
                styles.btnStyle,
              ]}
              disabled={
                isLoadingPay ||
                isLoading ||
                _.isEmpty(customer) ||
                !(customer && customer.paymentMethod)
              }
              onPress={() => sendQuickPayInvoice()}>
              {isLoadingPay ? (
                <ActivityIndicator
                  color={Colors.white}
                  size={25}
                  style={styles.loaderIcon}
                />
              ) : (
                <Text
                  style={[
                    GlobalStyles.secondaryButtonText,
                    !_.isEmpty(customer) && customer.paymentMethod
                      ? ''
                      : styles.btnTextStyle,
                  ]}>
                  Pay Now
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.flexStyle}>
      <Header
        navigation={props.navigation}
        close={() =>
          props.navigation.navigate(
            props.route.params === 'Product' ? 'Products' : 'QuickPay',
          )
        }
        title={'Checkout'}
      />
      {data.length ? renderHeader() : <></>}
      <KeyboardAwareFlatList
        style={GlobalStyles.flexStyle}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        data={data}
        // ListHeaderComponent={data.length && renderHeader}
        // ListFooterComponent={data.length && renderFooter}
        renderItem={({item, index}) => renderProductItem(item, index)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
      />
      {data.length ? renderFooter() : <></>}
      <CustomersList
        visible={showCustomerModal}
        closeModal={(customer) => {
          getCustomer(customer);
        }}
      />
      <ProductDetailModal
        visible={showProductDetailModal}
        closeModal={() => {
          setShowProductDetailModal(false);
          setSelectedProduct('');
        }}
        product={selectedProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    paddingVertical: 2,
  },
  customerContainer: {
    // margin: 2,
    backgroundColor: Colors.white,
    padding: 10,
    shadowColor: '#303838',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.1,
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectCustomerText: (isCustomerSelected) => ({
    fontWeight: isCustomerSelected ? '700' : 'bold',
    fontSize: isCustomerSelected ? 16 : 18,
    textAlign: isCustomerSelected ? 'left' : 'center',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 20,
    color: isCustomerSelected ? Colors.black : Colors.primary,
  }),
  emailText: {
    fontWeight: 'normal',
  },
  customerSelectContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    shadowColor: '#303838',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.1,
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.primary,
  },
  changeText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  productImage: {
    height: 90,
    width: 68,
    marginRight: 16,
  },
  productContainer: {
    margin: 2,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    shadowColor: '#303838',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.1,
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  productDetailContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
  },
  priceContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    paddingTop: 10,
    // marginTop: 3,
  },
  priceDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 16,
  },
  totalContainer: {
    paddingVertical: 3,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: Colors.white,
  },
  errorMessage: {
    color: Colors.red,
    textAlign: 'center',
  },
  btnStyle: {
    flex: 1,
    borderRadius: 0,
    height: 42,
  },
  invoiceButtonStyle: {
    backgroundColor: Colors.secondary,
  },
  loaderIcon: {
    backgroundColor: 'transparent',
  },
  btnTextStyle: {color: Colors.white},
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  goToButtonContainer: {
    marginTop: 10,
  },
});
