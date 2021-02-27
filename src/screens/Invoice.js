import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/Colors';
import currencyFormatter from 'currency-formatter';
import Default from '../constants/Default';
import Header from '../components/Header';
import InvoiceDetailModal from '../components/InvoiceDetail';
import {invoiceAction} from '../store/actions';
import * as _ from 'lodash';
import moment from 'moment';
import SearchComponent from '../components/SearchComponent';

export default function Invoice(props) {
  const dispatch = useDispatch();
  const reducState = useSelector(({auth, invoice}) => ({
    auth,
    invoice,
  }));
  const tabsList = ['All', 'Overdue', 'Unpaid', 'Paid', 'Draft'];
  const [data, setData] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [filterTotal, setFilterTotal] = useState('');
  const [startAfter, setStartAfter] = useState('');
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [status, setStatus] = useState('');
  const [dueDate, setdueDate] = useState({lt: '', gte: ''});
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const accountId =
    reducState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  useEffect(() => {
    setData(reducState.invoice.invoices);
  }, [reducState.invoice.invoices]);

  useEffect(() => {
    getData();
  }, [activeTab, status, dueDate]);

  const getTabData = (tab) => {
    setData('');
    setActiveTab(tab);
    setStartAfter('');
    switch (tab) {
      case 'All':
        {
          setStatus('');
          setdueDate({lt: '', gte: ''});
        }
        break;
      case 'Overdue':
        {
          setStatus('open');
          setdueDate({lt: moment().unix()});
        }
        break;
      case 'Unpaid':
        {
          setStatus('open');
          setdueDate({gte: moment().unix()});
        }
        break;
      case 'Paid':
        {
          setStatus('paid');
          setdueDate({lt: '', gte: ''});
        }
        break;
      case 'Draft':
        {
          setStatus('draft');
          setdueDate({lt: '', gte: ''});
        }
        break;
    }
  };

  const delayedQuery = useCallback(
    _.debounce(() => fetchData(), 1000),
    [filterTotal],
  );

  useEffect(() => {
    if (!isLoading && !isLoadMoreLoader) {
      setIsSearchLoading(true);
      setStartAfter('');
      delayedQuery();
    }
    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [filterTotal, delayedQuery]);

  const fetchData = async () => {
    const invoiceData = await dispatch(
      invoiceAction.getInvoices({
        accountId,
        filterTotal,
        status,
        dueDate,
      }),
    );
    if (invoiceData?.invoices?.has_more === true) {
      setStartAfter(invoiceData.invoices.data[Default.perPageLimit - 1].id);
    }
    // if (isSearchLoading === true) {
    setIsSearchLoading(false);
    // }
  };

  const getData = async () => {
    setIsLoading(true);
    await fetchData();
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefresh(true);
    setStartAfter('');
    await getData();
    setRefresh(false);
  };

  const handleLoadMore = async () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      reducState.invoice.has_more === true
    ) {
      setIsLoadMoreLoader(true);
      const invoiceData = await dispatch(
        invoiceAction.getInvoices({
          accountId,
          filterTotal,
          startAfter,
          status,
          dueDate,
        }),
      );
      if (invoiceData?.invoices?.has_more === true) {
        setStartAfter(invoiceData.invoices.data[19].id);
      }
      setIsLoadMoreLoader(false);
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  const getStatus = (status, dueDate) => {
    if (status === 'open') {
      if (dueDate && dueDate >= moment().unix()) {
        return 'sent';
      } else {
        return 'overdue';
      }
    } else {
      return status;
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.tabsContainer}>
        {tabsList.map((tab) => {
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                getTabData(tab);
              }}>
              <Text
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTab,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      // <TouchableOpacity
      //   style={styles.invoiceContainer}
      //   key={index.toString()}
      //   onPress={() => {
      //     setShowInvoiceDetailModal(true);
      //     setSelectedInvoice(item);
      //   }}>
      <View style={styles.invoiceContainer}>
        <View style={styles.detailContainer}>
          {item.customer_name && (
            <Text
              style={styles.invoiceBusinessName}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {item.customer_name}
            </Text>
          )}
          <Text
            style={styles.invoiceText}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {item.customer_email}
          </Text>
          {item.customer_phone && (
            <Text style={styles.invoiceText}>{item.customer_phone}</Text>
          )}
        </View>
        <View style={styles.priceContainer}>
          <View
            style={styles.statusContainer(
              getStatus(item.status, item.due_date),
            )}>
            <Text style={styles.statusText}>
              {getStatus(item.status, item.due_date)}
            </Text>
          </View>
          <Text style={styles.priceText}>
            {currencyFormatter.format(item.total / 100, {
              code: _.toUpper(Default.currency),
            })}
          </Text>
        </View>
      </View>
      //  </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.loaderContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          reducState.invoice.has_more === false && (
            <Text style={GlobalStyles.footerText}>No invoice found.</Text>
          )
        )}
      </View>
    );
  };

  const renderFooterComponent = () => {
    return (
      !isLoading && (
        <View style={styles.loaderContainer}>
          {isLoadMoreLoader ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : reducState.invoice.has_more === false && startAfter ? (
            <Text style={GlobalStyles.footerText}>No more invoices.</Text>
          ) : (
            <></>
          )}
        </View>
      )
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.mainView}>
      <Header navigation={props.navigation} showMenu={true} title={'Invoice'} />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchComponent
            value={filterTotal}
            onChangeText={(txt) => setFilterTotal(txt)}
            placeholder="Search total amount"
            keyboardType={'numeric'}
            isSearchLoading={!isLoading && isSearchLoading}
          />
        </View>
        {renderHeader()}
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.invoiceMainContainer}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item.id}
          onMomentumScrollBegin={() =>
            setOnEndReachedCalledDuringMomentum(false)
          }
          onEndReached={() => handleLoadMore()}
          renderItem={({item}) => renderItem(item)}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooterComponent}
        />
      </View>
      <InvoiceDetailModal
        visible={showInvoiceDetailModal}
        closeModal={() => {
          setShowInvoiceDetailModal(false);
          setSelectedInvoice('');
        }}
        invoice={selectedInvoice}
      />
      <Modal transparent={true} visible={isLoading}>
        <View style={styles.modalView}>
          <ActivityIndicator
            style={styles.modalLoader}
            size={35}
            color={Colors.primary}
          />
        </View>
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    fontSize: 16,
    color: Colors.grey,
    paddingVertical: 6,
  },
  activeTab: {
    color: Colors.primary,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
  },
  loaderContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  invoiceMainContainer: {
    paddingHorizontal: 2,
    paddingBottom: 80,
  },
  invoiceContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.white,
    margin: 2,
    // borderBottomColor: Colors.bgColor,
    // borderBottomWidth: 0.5,
  },
  detailContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  invoiceBusinessName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  invoiceText: {
    fontSize: 12,
    color: Colors.greyText,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  statusContainer: (status) => ({
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    minWidth: 60,
    backgroundColor: Colors[status],
    elevation: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  }),
  statusText: {
    color: Colors.white,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
    opacity: 0.6,
  },
  modalLoader: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: Colors.grey,
    paddingVertical: 10,
    width: '15%',
    alignSelf: 'center',
  },
});
