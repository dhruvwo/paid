import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomIconsComponent from '../CustomIcons';
import GlobalStyles from '../../constants/GlobalStyles';
import {cartAction} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import {useState} from 'react/cjs/react.development';

export default function Note(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });
  const [note, setNote] = useState('');

  const updateCart = async (current) => {
    const data = {
      id: 'quickPay' + history.length,
      product: {type: 'quick Pay', note: note},
      price: current * 100,
    };
    console.log('data', data);
    // await dispatch(cartAction.updateCart(data));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          props.closeModal();
        }}>
        <CustomIconsComponent
          name={'chevron-back'}
          type={'Ionicons'}
          color={Colors.darkGrey}
          size={40}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: Colors.greyText,
          borderRadius: 50,
          paddingHorizontal: 20,
        }}>
        <View style={GlobalStyles.row}>
          <CustomIconsComponent
            style={styles.iconStyle}
            type={'SimpleLineIcons'}
            color={Colors.grey}
            size={20}
            name={'note'}
          />
          <TextInput
            style={styles.inputLabel}
            underlineColorAndroid="transparent"
            placeholder="Rembember me"
            // value={note}
            // onChangeText={(note) => setNote(note)}
          />
        </View>
        <TouchableOpacity style={styles.noteStyle}>
          <Text style={styles.noteText}>Note</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  noteStyle: {
    padding: 12,
    flexDirection: 'row',
  },
  noteText: {
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 2,
  },
});
