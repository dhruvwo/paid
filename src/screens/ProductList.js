import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/Colors';
import currencyFormatter from 'currency-formatter';
import {tax} from '../constants/Default';
import Header from '../components/Header';
import CustomIconsComponent from '../components/CustomIcons';
import FastImage from 'react-native-fast-image';
import ProductDetailModal from '../components/ProductDetail';

export default function ProductList(props) {
  const [searchText, setSearchText] = useState('');
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);

  const data = [
    {index: 0, name: 'Anti Virus', image: '', price: '109.8'},
    {index: 1, name: 'Abc Xyz', image: '', price: '45.7'},
    {index: 2, name: 'Abc Xyz', discription: '1 hr', image: '', price: '32.9'},
    {index: 3, name: 'Abc Xyz', image: '', price: '89.3'},
    {index: 4, name: 'Abc Xyz', image: '', price: '109.8'},
    {index: 5, name: 'Abc Xyz', discription: '1 hr', image: '', price: '45.7'},
    {index: 6, name: 'Abc Xyz', image: '', price: '32.9'},
    {index: 7, name: 'Abc Xyz', image: '', price: '89.3'},
    {index: 8, name: 'Abc Xyz', image: '', price: '109.8'},
    {index: 9, name: 'Abc Xyz', image: '', price: '45.7'},
    {index: 12, name: 'Abc Xyz', image: '', price: '32.9'},
    {index: 13, name: 'Abc Xyz', image: '', price: '89.3'},
    {index: 10, name: 'Abc Xyz', image: '', price: '109.8'},
    {index: 11, name: 'Abc Xyz', image: '', price: '45.7'},
    {index: 14, name: 'Abc Xyz', image: '', price: '32.9'},
    {index: 15, name: 'Abc Xyz', image: '', price: '89.3'},
    {index: 16, name: 'Abc Xyz', image: '', price: '109.8'},
    {index: 17, name: 'Abc Xyz', image: '', price: '45.7'},
    {index: 18, name: 'Abc Xyz', image: '', price: '32.9'},
    {index: 19, name: 'Abc Xyz', image: '', price: '89.3'},
  ];

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        key={index}
        onPress={() => {
          setShowProductDetailModal(true);
        }}>
        <View style={GlobalStyles.row}>
          <FastImage
            style={styles.productImage}
            resizeMode={'cover'}
            source={require('../assets/products/product1.jpg')}
          />
          <View style={styles.productNameContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.discription}</Text>
          </View>
        </View>
        <View style={[GlobalStyles.row, styles.productPriceContainer]}>
          <Text style={styles.productPrice}>
            {currencyFormatter.format(item.price, {code: 'USD'})}
          </Text>
          <CustomIconsComponent
            style={{paddingVertical: 4}}
            name={'chevron-forward'}
            type={'Ionicons'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.mainView}>
      <Header navigation={props.navigation} />
      <View style={styles.container}>
        <View style={styles.answerStyles}>
          <Text style={[styles.value, {color: Colors.primary}]}>
            Charge{' '}
            {currencyFormatter.format(
              props.result + (props.result * tax) / 100,
              {
                code: 'USD',
              },
            )}
          </Text>
          <Text style={[styles.value, styles.taxText]}>Including Tax</Text>
        </View>
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
            <CustomIconsComponent
              style={[styles.searchIcon, {alignSelf: 'flex-end'}]}
              type={'Ionicons'}
              color={Colors.primary}
              name={'add'}
            />
          </View>
          <FlatList
            data={data}
            renderItem={({item, index}) => renderItem(item, item.index)}
            ItemSeparatorComponent={() => {
              return <View style={styles.itemSeparator} />;
            }}
            keyExtractor={(item) => item.key}
            ListEmptyComponent={() => {
              return (
                <View>
                  <Text style={styles.noDataFound}>Product List is empty</Text>
                </View>
              );
            }}
          />
          {/* <TouchableOpacity
            style={GlobalStyles.buttonContainer}
            onPress={() => props.navigation.navigate('Checkout')}>
            <Text style={GlobalStyles.buttonText}>Checkout</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={showProductDetailModal}
        onRequestClose={() => {
          setShowProductDetailModal(false);
        }}>
        <View>
          <ProductDetailModal
            closeModal={() => {
              setShowProductDetailModal(false);
            }}
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
    // flexDirection: 'column',
    // backgroundColor: '#9BCCAF',
    backgroundColor: Colors.white,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  value: {
    color: Colors.greyText,
    fontSize: 34,
    textAlign: 'center',
  },
  answerStyles: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 20,
    width: '95%',
    alignSelf: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    color: Colors.primary,
    flexGrow: 1,
    maxHeight: 80,
    justifyContent: 'center',
  },
  taxText: {color: Colors.primary, fontSize: 12},
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
    // width: '85%',
    paddingHorizontal: 4,
  },
  searchIcon: {
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  itemContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemSeparator: {
    borderBottomWidth: 0.5,
    marginHorizontal: 10,
    borderBottomColor: 'grey',
  },
  productImage: {
    height: 40,
    width: 40,
    marginHorizontal: 4,
  },
  productNameContainer: {
    // paddingVertical: 8,
    paddingHorizontal: 8,
  },
  productName: {
    fontSize: 18,
  },
  productPrice: {
    fontSize: 16,
    paddingVertical: 5,
  },
});
