import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/Colors';
import currencyFormatter from 'currency-formatter';
import Default from '../constants/Default';
import Header from '../components/Header';
import CustomIconsComponent from '../components/CustomIcons';
import FastImage from 'react-native-fast-image';
import ProductDetailModal from '../components/ProductDetail';
import {productAction} from '../store/actions';
import * as _ from 'lodash';

export default function ProductList(props) {
  const dispatch = useDispatch();
  const productState = useSelector(({auth, product}) => {
    return {
      auth,
      product,
    };
  });
  const [refresh, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [start, setStart] = useState(0);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const accountId =
    productState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [searchText]);

  const getData = async () => {
    setIsLoading(true);
    await dispatch(productAction.getProducts(accountId, searchText, 0));
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefresh(true);
    setStart(0);
    await getData();
    setRefresh(false);
  };

  const handleLoadMore = async () => {
    let startIndex = _.cloneDeep(start);
    if (
      !onEndReachedCalledDuringMomentum &&
      startIndex + Default.perPageLimit < productState.product.totalProducts
    ) {
      setIsLoadMoreLoader(true);
      setStart(startIndex + Default.perPageLimit);
      await dispatch(
        productAction.getProducts(
          accountId,
          searchText,
          startIndex + Default.perPageLimit,
        ),
      );
      setIsLoadMoreLoader(false);
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        key={item.id}
        onPress={() => {
          setShowProductDetailModal(true);
          setSelectedProduct(item);
        }}>
        <View style={styles.productContainer}>
          <FastImage
            style={styles.productImage}
            resizeMode={'cover'}
            source={require('../assets/products/product2.jpg')}
          />
          <View style={styles.productNameContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text
              style={styles.productDescription}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>
            {currencyFormatter.format(item.prices[0].unitAmountDecimal, {
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
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text style={styles.noDataFound}>No products</Text>
        )}
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      !isLoading && (
        <View>
          {isLoadMoreLoader ? (
            <ActivityIndicator size="large" color={Colors.greyText} />
          ) : (
            start + Default.perPageLimit <=
              productState.product.totalProducts && (
              <Text style={styles.footerText}>No more products</Text>
            )
          )}
        </View>
      )
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.mainView}>
      <Header navigation={props.navigation} />
      <View style={styles.container}>
        <View style={GlobalStyles.flexStyle}>
          <View style={styles.searchContainer}>
            <View style={GlobalStyles.row}>
              <CustomIconsComponent
                style={styles.searchIcon}
                type={'AntDesign'}
                color={Colors.primary}
                name={'search1'}
              />
              <TextInput
                style={styles.searchInput}
                underlineColorAndroid="transparent"
                placeholder="Search"
                value={searchText}
                onChangeText={(txt) => setSearchText(txt)}
              />
            </View>
          </View>
          <FlatList
            data={productState.product.products}
            refreshing={refresh}
            onRefresh={onRefresh}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() =>
              setOnEndReachedCalledDuringMomentum(false)
            }
            renderItem={({item, index}) => renderItem(item, index)}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooterComponent}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyComponent}
          />
        </View>
      </View>
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
    backgroundColor: Colors.white,
    justifyContent: 'flex-end',
  },
  searchContainer: {
    marginTop: 2,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#E4E1E1',
    marginHorizontal: 4,
    justifyContent: 'space-between',
  },
  searchInput: {
    minHeight: 50,
    height: 50,
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  searchIcon: {
    paddingTop: 12,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  productContainer: {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
  },
  productImage: {
    height: 50,
    width: 50,
    marginHorizontal: 4,
  },
  productNameContainer: {
    paddingHorizontal: 8,
  },
  productName: {
    fontSize: 18,
  },
  productDescription: {
    flexGrow: 1,
    flexShrink: 1,
  },
  productPriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  footerText: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  noDataFound: {
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 10,
  },
});
