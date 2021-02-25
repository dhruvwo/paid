import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import CustomIconsComponent from '../CustomIcons';
import {customerAction} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import Default from '../../constants/Default';
import * as _ from 'lodash';
import AddCustomer from './AddCustomer';
import Header from '../Header';

export default function Customer(props) {
  const dispatch = useDispatch();
  const customerState = useSelector(({auth, customer}) => {
    return {
      auth,
      customer,
    };
  });
  const accountId =
    customerState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  const [refresh, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [start, setStart] = useState(0);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getCustomer();
  }, []);

  useEffect(() => {
    if (searchText) {
      setStart(0);
      getCustomer();
    }
  }, [searchText]);

  const getCustomer = async () => {
    setIsLoading(true);
    await dispatch(customerAction.getCustomers(accountId, searchText, start));
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefresh(true);
    setStart(0);
    await getCustomer();
    setRefresh(false);
  };

  const handleLoadMore = async () => {
    let startIndex = _.cloneDeep(start);
    if (!onEndReachedCalledDuringMomentum && customerState.customer.hasMore) {
      setIsLoadMoreLoader(true);
      setStart(startIndex + Default.perPageLimit);
      await dispatch(
        customerAction.getCustomers(
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
      <View>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={styles.footerText}>No customer</Text>
        )}
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      !isLoading && (
        <View>
          {isLoadMoreLoader ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            !customerState.customer.hasMore && (
              <Text style={styles.footerText}>No more customer</Text>
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
      <View style={styles.container}>
        <Header
          navigation={props.navigation}
          title="Customers"
          close={() => props.closeModal()}
        />
        <View style={styles.searchContainer}>
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
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <CustomIconsComponent
              style={styles.searchIcon}
              type={'Feather'}
              color={Colors.primary}
              name={'user-plus'}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.customerMainContainer}
          data={customerState.customer.customers}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          renderItem={({item, index}) => renderItem(item, index)}
          onEndReached={handleLoadMore}
          ListFooterComponent={() => renderFooterComponent()}
          keyExtractor={(item) => item.customerId}
          ListEmptyComponent={() => renderEmptyComponent()}
        />
      </View>
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
    flexGrow: 1,
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
  footerText: {
    fontSize: 14,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
