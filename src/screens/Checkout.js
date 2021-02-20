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
  Platform,
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
        <View style={GlobalStyles.row}>
          <View style={[GlobalStyles.row, styles.imageContainer]}>
            <FastImage
              style={styles.productImage}
              resizeMode={'cover'}
              source={require('../assets/products/product2.png')}
            />
          </View>
          <View style={styles.productDetailContainer}>
            <View style={styles.titleIconContainer}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <TouchableOpacity
                style={styles.deleteContainer}
                onPress={() => deleteProduct(item.id)}>
                <CustomIconsComponent
                  name={'delete-outline'}
                  type={'MaterialCommunityIcons'}
                  color={Colors.red}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.productPrice}>
              {currencyFormatter.format((item.price / 100) * item.qty, {
                code: _.toUpper(Default.currency),
              })}
            </Text>
            <View style={[GlobalStyles.row, styles.quantityContainer]}>
              <View style={[styles.qtyContainer]}>
                <TouchableOpacity
                  style={styles.qtyBtn('-')}
                  onPress={() => {
                    item.qty > 1 && updateCart(item, '-');
                  }}>
                  <CustomIconsComponent
                    name={'minus'}
                    size={25}
                    col
                    type={'Entypo'}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.qtyText,
                    {
                      marginHorizontal: 10,
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
                  <CustomIconsComponent
                    name={'add'}
                    size={25}
                    col
                    type={'MaterialIcons'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View></View>
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
      <View style={[styles.totalView]}>
        <View
          style={[
            GlobalStyles.row,
            styles.priceDetailContainer,
            {marginVertical: 0},
          ]}>
          <Text style={styles.taxText}>Total MRP</Text>
          <Text style={styles.billProductPrice}>
            {currencyFormatter.format(getTotal() / 100, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
        </View>
        <View style={[GlobalStyles.row, styles.priceDetailContainer]}>
          <Text style={styles.taxText}>
            Tax ({Default.tax * 100}% {Default.taxName})
          </Text>
          <Text style={styles.billProductPrice}>
            {currencyFormatter.format((getTotal() * Default.tax) / 100, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
        </View>
        <View style={[GlobalStyles.row, styles.totalAmountContainer]}>
          <View style={styles.totalContainer}>
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
              style={[styles.productContainer, styles.selectProductContainer]}
              disabled={!_.isEmpty(customer)}
              onPress={() => setShowCustomerModal(true)}>
              <Text style={styles.selectCustomerText(!_.isEmpty(customer))}>
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
              {!_.isEmpty(customer) && (
                <TouchableOpacity onPress={() => setShowCustomerModal(true)}>
                  <Text style={styles.changeText}>CHANGE</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
          <FlatList
            data={cartState.cart.products}
            renderItem={({item, index}) => renderItem(item, index)}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyComponent}
          />
          {renderFooterComponent()}
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              style={[
                GlobalStyles.secondaryButtonContainer,
                !_.isEmpty(customer) && customer.paymentMethod
                  ? ''
                  : styles.disableButton,
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
        <View style={[styles.container, styles.emptyContainer]}>
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
  },
  customerContainer: {
    paddingTop: 8,
    paddingBottom: 3,
  },
  productImage: {
    height: 100,
    width: 100,
    marginHorizontal: 4,
  },
  loaderIcon: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  productContainer: {
    marginVertical: 5,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#303838',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  totalView: {
    backgroundColor: Colors.white,
    paddingVertical: 5,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 19,
    // fontWeight: 'bold',
  },
  taxText: {
    fontSize: 16,
  },
  qtyContainer: {
    flexDirection: 'row',
  },
  qtyText: {
    fontSize: 20,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  qtyBtn: (txt) => ({
    backgroundColor: Colors.bgColor,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    alignItems: 'center',
  }),
  noDataFound: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectCustomerText: (isCustomerSelected) => ({
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: isCustomerSelected ? 'left' : 'center',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 20,
    color: isCustomerSelected ? Colors.black : Colors.primary,
    marginVertical: 10,
  }),
  totalContainer: {
    width: '100%',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'lightgrey',
    paddingVertical: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  billProductPrice: {
    fontSize: 18,
  },
  changeText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productDetailContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 20,
  },
  sendButtonContainer: {
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  deleteContainer: {
    paddingTop: 5,
  },
  titleIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  imageContainer: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  disableButton: {
    backgroundColor: Colors.greyText,
    borderColor: Colors.greyText,
  },
  totalAmountContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  priceDetailContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});
