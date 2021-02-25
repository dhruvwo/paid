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
import Customer from '../components/customer/Customer';
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
  const cartState = useSelector(({auth, product, customer, cart}) => {
    return {
      auth,
      product,
      customer,
      cart,
    };
  });

  const stripeDetails = cartState?.auth?.userSetup?.payments?.stripeDetails;
  const data =
    props.route.params === 'Product'
      ? cartState.cart.products
      : cartState.cart.quickPay;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPay, setIsLoadingPay] = useState(false);
  const [customer, setCustomer] = useState({});
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [error, setError] = useState('');
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
    const data = {
      accountId: stripeDetails.accountId,
      companyId: stripeDetails.companyId,
      amount: getTotal() + getTotal() * Default.tax,
      email: customer.email,
      customer: customer.customerId,
      subTotal: getTotal(),
      productItemsArray: getProductItemsArray(),
      currency: Default.currency,
      default_tax_rates: [Default.taxId],
      due_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      terms: 'due',
    };
    const invoice = await dispatch(invoiceAction.sendInvoice(data));
    if (invoice.status === 'success') {
      setIsLoading(false);
      dispatch(cartAction.clearCart());
      props.navigation.navigate('Products');
      ToastService({
        message: 'Invoice send successfully !',
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
      amount: getTotal() + getTotal() * Default.tax,
      email: customer.email,
      customer: customer.customerId,
      currency: Default.currency,
      paymentMethod: customer.paymentMethod.id,
    };
    const pay = await dispatch(invoiceAction.sendQuickPayInvoice(data));
    if (pay.status === 'success') {
      setIsLoadingPay(false);
      props.route.params === 'Product'
        ? dispatch(cartAction.clearCart())
        : dispatch(cartAction.clearQuickPay());
      props.navigation.navigate('Home');
      ToastService({
        message: 'Paid successfully !',
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

  const updateCart = async (item) => {
    await dispatch(cartAction.updateCart(item));
  };

  const deleteProduct = (id) => {
    Alert.alert(
      '',
      `${
        'Do you really want to remove this ' +
        (props.route.params === 'Product' ? 'product' : 'payment') +
        ' from cart?'
      }`,
      [
        {
          text: 'yes',
          onPress: () => {
            props.route.params === 'Product'
              ? dispatch(cartAction.removeProduct(id))
              : dispatch(cartAction.removeQuickPay(id));
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const renderProductItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.productContainer}
        key={item.id}
        onPress={() => {
          setShowProductDetailModal(true);
          setSelectedProduct(item.product);
        }}>
        <FastImage
          style={styles.productImage}
          resizeMode={'cover'}
          source={require('../assets/products/product6.png')}
        />
        <View style={styles.productDetailContainer}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.productPrice}>
            {currencyFormatter.format((item.price / 100) * item.qty, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
          <QuantityComponent
            item={item}
            deleteProduct={(id) => deleteProduct(id)}
            getQuantity={(data) => updateCart(data)}
          />
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

  const renderQuickPayItem = (item, index) => {
    return (
      <View style={styles.productContainer} key={item.id}>
        <View style={styles.productDetailContainer}>
          <Text style={styles.productName}>
            {currencyFormatter.format((item.price / 100) * item.qty, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
          {item.product.note ? (
            <Text style={styles.productPrice}>{item.product.note}</Text>
          ) : (
            <></>
          )}
        </View>
        <TouchableOpacity onPress={() => deleteProduct(item.id)}>
          <CustomIconsComponent
            name={'delete-outline'}
            type={'MaterialCommunityIcons'}
            color={Colors.red}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.footerText}>Cart is empty.</Text>
        <TouchableOpacity
          style={GlobalStyles.secondaryButtonContainer}
          onPress={() => {
            const navPage =
              props.route.params === 'Product' ? 'Products' : 'Quick Pay';
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
      <TouchableOpacity
        style={styles.customerContainer}
        onPress={() => setShowCustomerModal(true)}>
        {_.isEmpty(customer) ? (
          <Text style={styles.selectCustomerText(!_.isEmpty(customer))}>
            Select customer
          </Text>
        ) : (
          <>
            <View>
              <Text style={styles.selectCustomerText(!_.isEmpty(customer))}>
                {`${
                  customer?.metadata?.first_name +
                  `` +
                  customer?.metadata?.last_name +
                  (customer?.metadata?.business_name
                    ? ` (` + customer?.metadata?.business_name + `) `
                    : '')
                }`}
              </Text>
              <Text style={styles.selectCustomerText(!_.isEmpty(customer))}>
                {customer?.email}
              </Text>
            </View>
            <Text style={styles.changeText}>CHANGE</Text>
          </>
        )}
      </TouchableOpacity>
    );
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
                Tax ({Default.tax * 100}% {Default.taxName})
              </Text>
              <Text style={styles.priceText}>
                {currencyFormatter.format((getTotal() * Default.tax) / 100, {
                  code: _.toUpper(Default.currency),
                })}
              </Text>
            </View>
            <View style={[styles.priceDetailContainer, styles.totalContainer]}>
              <Text style={styles.totalText}>Total Amount </Text>
              <Text style={styles.totalText}>
                {currencyFormatter.format(
                  (getTotal() + getTotal() * Default.tax) / 100,
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
            {props.route.params === 'Product' && (
              <TouchableOpacity
                style={[
                  GlobalStyles.secondaryButtonContainer,
                  !_.isEmpty(customer)
                    ? ''
                    : GlobalStyles.buttonDisabledContainer,
                  styles.btnStyle,
                  styles.invoiceButtonStyle,
                ]}
                disabled={!!_.isEmpty(customer)}
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
              disabled={!(!_.isEmpty(customer) && customer.paymentMethod)}
              onPress={() =>
                !_.isEmpty(customer) &&
                customer.paymentMethod &&
                sendQuickPayInvoice()
              }>
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
        close={() => props.navigation.navigate('Home')}
        title={props.route.params === 'Product' ? 'Checkout' : 'Quick Charge'}
      />
      {data.length ? renderHeader() : <></>}
      <KeyboardAwareFlatList
        style={GlobalStyles.flexStyle}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        data={data}
        // ListHeaderComponent={data.length && renderHeader}
        // ListFooterComponent={data.length && renderFooter}
        renderItem={({item, index}) =>
          props.route.params === 'Product'
            ? renderProductItem(item, index)
            : renderQuickPayItem(item, index)
        }
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
      />
      {data.length ? renderFooter() : <></>}
      <Customer
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
  changeText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  productImage: {
    height: 90,
    width: 68,
  },
  productContainer: {
    margin: 2,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 6,
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
    paddingHorizontal: 20,
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
  footerText: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
