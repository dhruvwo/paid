import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomIconsComponent from '../CustomIcons';
import {customerAction} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import Default from '../../constants/Default';
import * as _ from 'lodash';
import AddCustomer from './AddCustomer';
import Header from '../Header';
import GlobalStyles from '../../constants/GlobalStyles';
import SearchComponent from '../SearchComponent';

export default function CustomersList(props) {
  const dispatch = useDispatch();
  const reducState = useSelector(({auth, customer}) => ({
    auth,
    customer,
  }));
  const accountId =
    reducState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  const [refresh, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [start, setStart] = useState(0);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getCustomer();
  }, []);

  const delayedQuery = useCallback(
    _.debounce(async () => await getCustomer(), 1000),
    [searchText],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsSearchLoading(true);
      setStart(0);
      delayedQuery();
    }
    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [searchText, delayedQuery]);

  const getCustomer = async () => {
    await dispatch(customerAction.getCustomers({accountId, searchText, start}));
    setIsLoading(false);
    setIsSearchLoading(false);
  };

  const onRefresh = async () => {
    setRefresh(true);
    setStart(0);
    await getCustomer();
    setRefresh(false);
  };

  const handleLoadMore = async () => {
    let startIndex = _.cloneDeep(start);
    if (!onEndReachedCalledDuringMomentum && reducState.customer.hasMore) {
      setIsLoadMoreLoader(true);
      setStart(startIndex + Default.perPageLimit);
      await dispatch(
        customerAction.getCustomers({
          accountId,
          searchText,
          start: startIndex + Default.perPageLimit,
        }),
      );
      setIsLoadMoreLoader(false);
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => props.closeModal(item)}
        key={item.customerId}>
        <View style={styles.customerContainer}>
          <View style={styles.detailContainer}>
            <Text
              style={styles.customerName}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {item.metadata.first_name} {item.metadata.last_name}
            </Text>
            <Text
              style={styles.customerDetail}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {item.email}
            </Text>
            {item.metadata.business_name && (
              <Text
                style={styles.customerDetail}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {item.metadata.business_name}
              </Text>
            )}
            {item.phone && (
              <Text
                style={styles.customerDetail}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {item.phone}
              </Text>
            )}
          </View>

          <View style={styles.cardContainer}>
            {item.paymentMethod && (
              <>
                <CustomIconsComponent
                  name={'credit-card'}
                  type={'FontAwesome'}
                  size={40}
                  color={Colors.secondary}
                />
                <Text style={styles.cartText}>
                  ** {item.paymentMethod.last4}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={GlobalStyles.emptyContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={GlobalStyles.footerText}>No customer found.</Text>
        )}
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      !isLoading &&
      !!reducState?.customer?.customers?.length && (
        <View style={GlobalStyles.emptyContainer}>
          {isLoadMoreLoader ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            !reducState.customer.hasMore && (
              <Text style={GlobalStyles.footerText}>No more customers.</Text>
            )
          )}
        </View>
      )
    );
  };

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      onRequestClose={() => {
        props.closeModal();
      }}>
      <SafeAreaView style={styles.container}>
        <Header
          navigation={props.navigation}
          title="Customers"
          close={() => props.closeModal()}
        />
        <View style={styles.searchContainer}>
          <SearchComponent
            isSearchLoading={!isLoading && isSearchLoading}
            value={searchText}
            onChangeText={(txt) => setSearchText(txt)}
          />
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <CustomIconsComponent
              style={styles.addUserIcon}
              type={'Feather'}
              color={Colors.primary}
              name={'user-plus'}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.customerMainContainer}
          data={reducState.customer.customers}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={handleLoadMore}
          renderItem={({item, index}) => renderItem(item, index)}
          ListFooterComponent={() => renderFooterComponent()}
          ListEmptyComponent={() => renderEmptyComponent()}
        />
      </SafeAreaView>
      <AddCustomer
        visible={showAddModal}
        closeModal={() => setShowAddModal(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    flex: 1,
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
    alignItems: 'center',
  },
  addUserIcon: {
    padding: 12,
  },
  customerMainContainer: {
    paddingBottom: 150,
  },
  customerContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 6,
    backgroundColor: Colors.white,
    padding: 10,
  },
  detailContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerDetail: {
    fontSize: 15,
  },
  cardContainer: {
    minWidth: 55,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cartText: {
    fontSize: 14,
  },
});
