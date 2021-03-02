import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/Colors';
import currencyFormatter from 'currency-formatter';
import Default from '../constants/Default';
import Header from '../components/Header';
import FastImage from 'react-native-fast-image';
import ProductDetailModal from '../components/ProductDetail';
import {productAction} from '../store/actions';
import * as _ from 'lodash';
import SearchComponent from '../components/SearchComponent';

export default function ProductList(props) {
  const dispatch = useDispatch();
  const reducState = useSelector(({auth, product}) => ({
    auth,
    product,
  }));
  const [refresh, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [start, setStart] = useState(0);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const accountId =
    reducState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  useEffect(() => {
    getData();
  }, []);

  const delayedQuery = useCallback(
    _.debounce(() => getData(), 1000),
    [searchText],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsSearchLoading(true);
      delayedQuery();
    }
    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [searchText, delayedQuery]);

  const getData = async () => {
    setIsLoading(true);
    await dispatch(
      productAction.getProducts({start: 0, accountId, searchText}),
    );
    setIsLoading(false);
    setIsSearchLoading(false);
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
      startIndex + Default.perPageLimit < reducState.product.totalProducts
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
        <FastImage
          style={styles.productImage}
          resizeMode={'cover'}
          source={require('../assets/products/product7.png')}
        />
        <View style={styles.productNameContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text
            style={styles.productDescription}
            ellipsizeMode="tail"
            numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text style={styles.productPrice}>
          {currencyFormatter.format(item.prices[0].unitAmountDecimal / 100, {
            code: _.toUpper(Default.currency),
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={GlobalStyles.emptyContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={GlobalStyles.footerText}>No product found.</Text>
        )}
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      !isLoading &&
      !!reducState.product.products.length && (
        <View style={GlobalStyles.emptyContainer}>
          {isLoadMoreLoader ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            start + Default.perPageLimit <=
              reducState.product.totalProducts && (
              <Text style={GlobalStyles.footerText}>No more products.</Text>
            )
          )}
        </View>
      )
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.mainView}>
      <Header
        navigation={props.navigation}
        title={'Products'}
        showMenu={true}
        showCheckout={true}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchComponent
            isSearchLoading={!isLoading && isSearchLoading}
            value={searchText}
            onChangeText={(txt) => setSearchText(txt)}
          />
        </View>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={reducState.product.products}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={handleLoadMore}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooterComponent}
          renderItem={({item, index}) => renderItem(item, index)}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
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
    flex: 1,
    width: '100%',
    backgroundColor: Colors.bgColor,
    justifyContent: 'flex-end',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  searchIcon: {
    padding: 12,
  },
  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  productImage: {
    height: 55,
    width: 40,
    marginHorizontal: 4,
  },
  productNameContainer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    color: Colors.greyText,
  },
  productPrice: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 10,

    fontWeight: '600',
  },
});
