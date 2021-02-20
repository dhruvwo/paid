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
import InvoiceDetailModal from '../components/InvoiceDetail';
import {invoiceAction} from '../store/actions';
import * as _ from 'lodash';
import moment from 'moment';

export default function Invoice(props) {
  const dispatch = useDispatch();
  const invoiceState = useSelector(({auth, invoice}) => {
    return {
      auth,
      invoice,
    };
  });
  const tabsList = ['All', 'Overdue', 'Unpaid', 'Paid', 'Draft'];
  const [refresh, setRefresh] = useState(false);
  const [filterTotal, setFilterTotal] = useState('');
  const [startAfter, setStartAfter] = useState('');
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [status, setStatus] = useState('');
  const [dueDate, setdueDate] = useState({lt: '', gte: ''});
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);

  const accountId =
    invoiceState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [activeTab, status, dueDate]);

  const getTabData = (tab) => {
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
          setdueDate({lt: moment().toDate().getTime(), gte: ''});
        }
        break;
      case 'Unpaid':
        {
          setStatus('open');
          setdueDate({lt: '', gte: moment().toDate().getTime()});
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

  useEffect(() => {
    if (filterTotal) {
      setStartAfter('');
      getData();
    }
  }, [filterTotal]);

  const getData = async () => {
    setIsLoading(true);
    const invoiceData = await dispatch(
      invoiceAction.getInvoices(
        accountId,
        filterTotal,
        '', //    startAfter
        '', //    filter_customer='',
        '', //    created='',
        status,
        dueDate,
      ),
    );
    if (invoiceData?.invoices?.has_more === true) {
      setStartAfter(invoiceData.invoices.data[Default.perPageLimit - 1].id);
    }
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
      invoiceState.invoice.has_more === true
    ) {
      setIsLoadMoreLoader(true);
      const invoiceData = await dispatch(
        invoiceAction.getInvoices(
          accountId,
          filterTotal,
          startAfter,
          '',
          '',
          status,
          dueDate,
        ),
      );
      if (invoiceData?.invoices?.has_more === true) {
        setStartAfter(invoiceData.invoices.data[19].id);
      }
      setIsLoadMoreLoader(false);
      setOnEndReachedCalledDuringMomentum(true);
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

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        key={index.toString()}
        onPress={() => {
          setShowInvoiceDetailModal(true);
          setSelectedInvoice(item);
        }}>
        <View style={styles.invoiceContainer}>
          <View style={styles.invoiceNameContainer}>
            <Text style={styles.invoiceName}>{item.customer_email}</Text>
            <Text style={styles.invoiceName}>{item.customer_name}</Text>
            <Text style={styles.invoiceName}>{item.customer_phone}</Text>
          </View>
        </View>
        <View style={styles.invoicePriceContainer}>
          <Text style={styles.invoiceName}>
            {item.created ? moment.unix(item.created).format('YYYY-MM-DD') : ''}
          </Text>
          <Text style={styles.invoiceName}>
            {item.due_date
              ? moment.unix(item.due_date).format('YYYY-MM-DD')
              : ''}
          </Text>
          <Text
            style={styles.invoiceDescription}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {item.status}
          </Text>
          <Text style={styles.invoicePrice}>
            {currencyFormatter.format(item.total / 100, {
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
          <Text style={styles.noDataFound}>No invoice</Text>
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
            invoiceState.invoice.has_more === false &&
            !(<Text style={styles.footerText}>No more invoice</Text>)
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
                value={filterTotal}
                onChangeText={(txt) => setFilterTotal(txt)}
              />
            </View>
          </View>
          {renderHeader()}
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <FlatList
              data={invoiceState.invoice.invoices}
              refreshing={refresh}
              onRefresh={onRefresh}
              extraScrollHeight={150}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() =>
                setOnEndReachedCalledDuringMomentum(false)
              }
              renderItem={({item, index}) => renderItem(item, index)}
              onEndReached={() => handleLoadMore()}
              // ListHeaderComponent={renderHeader}
              ListFooterComponent={renderFooterComponent}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmptyComponent}
            />
          )}
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={showInvoiceDetailModal}
        onRequestClose={() => {
          setShowInvoiceDetailModal(false);
          setSelectedInvoice('');
        }}>
        <InvoiceDetailModal
          closeModal={() => {
            setShowInvoiceDetailModal(false);
            setSelectedInvoice('');
          }}
          invoice={selectedInvoice}
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
    justifyContent: 'flex-end',
  },
  searchContainer: {
    marginTop: 2,
    flexDirection: 'row',
    borderWidth: 1,
    // borderRadius: 25,
    borderColor: '#E4E1E1',
    padding: 2,
    marginHorizontal: 4,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
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
  tabsContainer: {
    // marginHorizontal: 10,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
  },
  tabButton: {
    fontSize: 16,
    color: Colors.grey,
    paddingVertical: 5,
  },
  activeTab: {
    color: Colors.primary,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    margin: 3,
  },
  invoiceContainer: {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
  },
  invoiceImage: {
    height: 50,
    width: 50,
    marginHorizontal: 4,
  },
  invoiceNameContainer: {
    paddingHorizontal: 8,
  },
  invoiceName: {
    fontSize: 18,
  },
  invoiceDescription: {
    flexGrow: 1,
    flexShrink: 1,
  },
  invoicePriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  invoicePrice: {
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
