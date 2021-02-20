import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Modal,
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

  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

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
    // console.log('data', data);
    const invoice = await dispatch(invoiceAction.sendInvoice(data));
    if (invoice.status === 'success') {
      setIsLoading(false);
    } else {
      ToastService({
        message: invoice.data.message,
      });
      setIsLoading(false);
    }
  };

  const getProductItemsArray = () => {
    let arry = [];
    cartState.cart.products.map((val, i) => {
      arry.push({price: val.priceId, quantity: val.qty});
    });
    return arry;
  };

  const getCustomer = (customer) => {
    setShowCustomerModal(false);
    setCustomer(customer);
  };

  const updateCart = async (item, operator) => {
    item.qty = operator === '+' ? item.qty + 1 : item.qty - 1;
    await dispatch(cartAction.updateCart(item));
  };

  const deleteProduct = (id) => {
    Alert.alert('', 'Do you really want to remove product from cart', [
      {
        text: 'yes',
        onPress: () => {
          dispatch(cartAction.removeProduct(id));
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const getTotal = () => {
    let add = 0;
    cartState.cart.products.map((val, i) => {
      add += val.price * val.qty;
    });
    return add;
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.productContainer}
        key={item.id}
        onPress={() => {
          setShowProductDetailModal(true);
          setSelectedProduct(item.product);
        }}>
        <View style={[GlobalStyles.row, {justifyContent: 'space-between'}]}>
          <View style={GlobalStyles.row}>
            <FastImage
              style={styles.productImage}
              resizeMode={'cover'}
              source={require('../assets/products/product2.jpg')}
            />
            <Text style={styles.productName}>{item.product.name}</Text>
          </View>
          <TouchableOpacity
            style={{paddingTop: 5}}
            onPress={() => deleteProduct(item.id)}>
            <CustomIconsComponent
              name={'delete-outline'}
              type={'MaterialCommunityIcons'}
              color={Colors.red}
            />
          </TouchableOpacity>
        </View>
        <View>
          <View style={[GlobalStyles.row, {justifyContent: 'space-between'}]}>
            <Text style={styles.priceContainter}>
              Price:{' '}
              {currencyFormatter.format(item.price / 100, {
                code: _.toUpper(Default.currency),
              })}
            </Text>
            <View style={[styles.qtyContainer]}>
              <TouchableOpacity
                style={styles.qtyBtn('-')}
                onPress={() => {
                  item.qty > 1 && updateCart(item, '-');
                }}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.qtyText,
                  {
                    borderColor: Colors.greyText,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  },
                ]}>
                {item.qty}
              </Text>
              <TouchableOpacity
                style={styles.qtyBtn('+')}
                onPress={() => {
                  updateCart(item, '+');
                  // setQty(qty + 1);
                }}>
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.productPrice}>
            {currencyFormatter.format((item.price / 100) * item.qty, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View>
        <Text style={styles.noDataFound}>Cart is empty</Text>
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      <View style={[styles.productContainer, {alignItems: 'flex-end'}]}>
        <View style={GlobalStyles.row}>
          <Text style={styles.taxText}>
            Tax ({Default.tax * 100}% {Default.taxName}) :{' '}
          </Text>
          <Text style={styles.productPrice}>
            {currencyFormatter.format((getTotal() * Default.tax) / 100, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
        </View>
        <View style={GlobalStyles.row}>
          <Text style={styles.taxText}>Total : </Text>
          <Text style={styles.productPrice}>
            {currencyFormatter.format(
              (getTotal() + getTotal() * Default.tax) / 100,
              {
                code: _.toUpper(Default.currency),
              },
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.mainView}>
      <Header navigation={props.navigation} />
      {cartState?.cart?.products?.length ? (
        <View style={styles.container}>
          <View style={styles.customerContainer}>
            <TouchableOpacity
              style={styles.productContainer}
              onPress={() => setShowCustomerModal(true)}>
              <Text style={GlobalStyles.secondaryButtonText}>
                {_.isEmpty(customer)
                  ? 'Select customer'
                  : customer.metadata.business_name +
                    '-' +
                    customer.metadata.first_name +
                    ' ' +
                    customer.metadata.last_name +
                    '(' +
                    customer.email +
                    ')'}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={cartState.cart.products}
            renderItem={({item, index}) => renderItem(item, index)}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooterComponent}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              {currencyFormatter.format(
                (getTotal() + getTotal() * Default.tax) / 100,
                {
                  code: _.toUpper(Default.currency),
                },
              )}
            </Text>

            <TouchableOpacity
              style={[
                GlobalStyles.secondaryButtonContainer,
                !_.isEmpty(customer) && customer.paymentMethod
                  ? ''
                  : {backgroundColor: Colors.greyText},
              ]}
              disabled={!(!_.isEmpty(customer) && customer.paymentMethod)}
              onPress={() =>
                !_.isEmpty(customer) && customer.paymentMethod && sendInvoice()
              }>
              {isLoading ? (
                <ActivityIndicator
                  color={Colors.white}
                  size={28}
                  style={styles.loaderIcon}
                />
              ) : (
                <Text
                  style={[
                    GlobalStyles.secondaryButtonText,
                    !_.isEmpty(customer) && customer.paymentMethod
                      ? ''
                      : {color: Colors.white},
                  ]}>
                  Send Invoice
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.container,
            {justifyContent: 'center', paddingHorizontal: 20},
          ]}>
          <Text style={styles.noDataFound}>Cart is Empty.</Text>
          <TouchableOpacity
            style={GlobalStyles.secondaryButtonContainer}
            onPress={() => props.navigation.navigate('Products')}>
            <Text style={GlobalStyles.secondaryButtonText}>Product</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="slide"
        visible={showCustomerModal}
        onRequestClose={(customer) => {
          getCustomer(customer);
        }}>
        <Customer
          closeModal={(customer) => {
            getCustomer(customer);
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={showProductDetailModal}
        onRequestClose={() => {
          setShowProductDetailModal(false);
          setSelectedProduct('');
        }}>
        <ProductDetailModal
          closeModal={() => {
            setShowProductDetailModal(false);
            setSelectedProduct('');
          }}
          product={selectedProduct}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.bgColor,
    // justifyContent: 'flex-end',
  },
  customerContainer: {
    padding: 8,
  },
  productImage: {
    height: 70,
    width: 70,
    marginHorizontal: 4,
  },
  loaderIcon: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  productContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: Colors.white,
    paddingVertical: 5,
    paddingRight: 15,
    elevation: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  priceContainter: {
    fontSize: 20,
    textAlign: 'right',
    paddingHorizontal: 12,
  },
  productPrice: {
    fontSize: 24,
    textAlign: 'right',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 5,
    // marginHorizontal: 10,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  totalText: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 10,
    // textAlign: 'left',
    color: Colors.white,
  },
  taxText: {
    fontSize: 16,
    // textAlign: 'left',
    paddingTop: 16,
    // color: Colors.white,
  },
  iconStyle: {
    marginHorizontal: 3,
  },
  qtyContainer: {
    flexDirection: 'row',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
  },
  qtyText: {
    fontSize: 20,
    paddingHorizontal: 6,
    width: 40,
    textAlign: 'center',
  },
  qtyBtn: (txt) => ({
    borderTopLeftRadius: txt === '-' ? 10 : 0,
    borderBottomLeftRadius: txt === '-' ? 10 : 0,
    borderTopRightRadius: txt === '+' ? 10 : 0,
    borderBottomRightRadius: txt === '+' ? 10 : 0,
    borderWidth: 1,
    width: 30,
    borderColor: Colors.greyText,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  noDataFound: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
