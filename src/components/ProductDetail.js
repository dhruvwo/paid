import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Switch} from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import CustomIconsComponent from '../components/CustomIcons';

export default function ProductDetailModal(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View>
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={() => {
            props.closeModal();
          }}>
          <CustomIconsComponent
            name={'chevron-back'}
            type={'Ionicons'}
            size={50}
          />
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>Product Name</Text>
        <TouchableOpacity
          // style={[GlobalStyles.secondaryButtonContainer, {marginTop: 2}]}
          style={{margin: 12}}
          onPress={() => {}}>
          <Text style={GlobalStyles.secondaryButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modalContainer}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    // flex: 1,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: Colors.bgColor,
    justifyContent: 'space-between',
  },
  modalHeaderText: {
    fontSize: 28,
    paddingVertical: 4,
  },
  modalContainer: {
    // flex: 1,
    flexDirection: 'column',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  modalText: {
    fontSize: 18,
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
