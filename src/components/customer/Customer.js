import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import CustomIconsComponent from '../CustomIcons';
import {customerAction} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import Default from '../../constants/Default';
import * as _ from 'lodash';
import AddCustomer from './AddCustomer';

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
      console.log('searchText', searchText);
    }
  }, [searchText]);

  const getCustomer = async () => {
    setIsLoading(true);
    console.log('getCustomer searchText', searchText);
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
    // console.log('handle more called**');
    // have to start condition back when API return total
    if (
      !onEndReachedCalledDuringMomentum
      // &&
      // startIndex + Default.perPageLimit < customerState.customer.total
    ) {
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
    // console.log('item', item, props);
    return (
      <TouchableOpacity
        onPress={() => props.closeModal(item)}
        key={item.customerId}>
        <View style={[GlobalStyles.row, styles.customerContainer]}>
          <View style={[GlobalStyles.row]}>
            <View>
              <Text style={styles.customerName}>
                {item.metadata.first_name} {item.metadata.last_name}
              </Text>
              <Text style={styles.customerName}>{item.email}</Text>
              <Text>{item.metadata.business_name}</Text>
              {item.phone && <Text>{item.phone}</Text>}
            </View>
          </View>
          {item.paymentMethod && (
            <View>
              <CustomIconsComponent
                name={
                  item.paymentMethod.brand === 'mastercard'
                    ? 'cc-mastercard'
                    : 'credit-card'
                }
                type={'FontAwesome'}
                size={50}
                color={Colors.secondary}
              />
              <Text>**** {item.paymentMethod.last4}</Text>
            </View>
          )}
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
          <Text style={styles.noDataFound}>No customer</Text>
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
            start + Default.perPageLimit <= customerState.customer.total && (
              <Text style={styles.footerText}>No more customer</Text>
            )
          )}
        </View>
      )
    );
  };

  return showAddModal ? (
    <AddCustomer closeModal={() => setShowAddModal(false)} />
  ) : (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <CustomIconsComponent
            style={styles.searchIcon}
            type={'Feather'}
            color={Colors.primary}
            name={'user-plus'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.customerMainContainer}>
        <FlatList
          data={customerState.customer.customers}
          refreshing={refresh}
          onRefresh={onRefresh}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
  },
  header: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: 2,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: Colors.white,
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
  customerMainContainer: {
    paddingBottom: 120,
  },
  customerContainer: {
    marginVertical: 4,
    marginHorizontal: 10,
    backgroundColor: Colors.white,
    padding: 10,
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: 20,
  },
  customerDetail: {
    fontSize: 16,
  },
});
