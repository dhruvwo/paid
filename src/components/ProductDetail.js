import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Switch} from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import CustomIconsComponent from '../components/CustomIcons';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

export default function ProductDetailModal(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={{color: Colors.bgColor}}>
        <TouchableOpacity
          onPress={() => {
            props.closeModal();
          }}>
          <CustomIconsComponent
            name={'chevron-back'}
            type={'Ionicons'}
            // color={Colors.white}
            size={50}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productImageContainer}>
        <FastImage
          style={styles.productImage}
          resizeMode={'cover'}
          source={require('../assets/products/product1.jpg')}
        />
      </View>

      <ScrollView style={styles.modalContainer}>
        <View style={styles.productContainer}>
          <Text style={styles.modalText}>Product Name</Text>
          <Text style={styles.modalText}>Description</Text>
        </View>

        <View style={[GlobalStyles.row, styles.productContainer]}>
          <Text style={styles.modalText}>Regular</Text>
          <Text style={styles.modalText}>Price</Text>
        </View>

        <View style={[GlobalStyles.row, styles.productContainer]}>
          <Text style={styles.modalText}>50% Off Sale</Text>
          <Text style={styles.modalText}>Price</Text>
        </View>

        <View style={styles.productContainer}>
          <Text style={styles.modalText}>Quantity</Text>
          {/* <Text style={styles.modalText}>Slider</Text> */}
        </View>

        <View style={styles.productContainer}>
          <Text style={styles.modalText}>Notes</Text>
          <Text style={styles.modalText}>Input</Text>
        </View>

        <View style={[GlobalStyles.row, styles.productContainer]}>
          <Text style={styles.modalText}>TAXES</Text>
        </View>

        <View style={[GlobalStyles.row, styles.productContainer]}>
          <Text style={styles.modalText}>HST(13%)</Text>
          <Switch
            trackColor={{false: Colors.darkGrey, true: Colors.primary}}
            thumbColor={isEnabled ? Colors.white : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.bgColor,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingTop: 4,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  modalHeaderText: {
    fontSize: 28,
    paddingVertical: 4,
  },
  modalContainer: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
  },
  productImageContainer: {
    alignItems: 'center',
    margin: 10,
  },
  productImage: {
    height: 300,
    width: '100%',
    borderRadius: 10,
  },
  productContainer: {
    color: Colors.darkGrey,
    borderBottomWidth: 1,
    borderColor: Colors.grey,
    paddingVertical: 16,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
});
