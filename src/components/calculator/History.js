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
import currencyFormatter from 'currency-formatter';
import {tax, currency} from '../../constants/Default';
import {cartAction} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import {useState} from 'react/cjs/react.development';

export default function History(props) {
  const dispatch = useDispatch();
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });
  const [isEdit, setIsEdit] = useState(0);
  const [currentVal, setCurrentVal] = useState(props.history[isEdit]);

  const updateCart = async (current) => {
    const data = {
      id: 'quickPay' + history.length,
      product: {type: 'quick Pay', note: ''},
      price: currentVal * 100,
    };
    console.log('data', data);
    // await dispatch(cartAction.updateCart(data));
  };

  return (
    <SafeAreaView>
      <View style={GlobalStyles.row}>
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
        <Text style={styles.header}>History</Text>
      </View>
      <View style={{paddingVertical: 50, paddingHorizontal: 10}}>
        {props.history.map((val, i) => {
          return (
            <View key={i}>
              <View
                style={[
                  GlobalStyles.row,
                  {paddingVertical: 10, justifyContent: 'space-between'},
                ]}>
                <TouchableOpacity style={styles.noteStyle}>
                  <Text style={styles.noteText}>Edit </Text>
                </TouchableOpacity>
                <Text style={{fontSize: 18}}>
                  {val} + {(val * 3) / 100} = {val + (val * 3) / 100}
                </Text>
              </View>
              <View style={[GlobalStyles.row, {justifyContent: 'flex-end'}]}>
                {i > 0 && props.history.length - 1 === i && (
                  <Text style={{fontSize: 24}}>
                    {' = ' +
                      currencyFormatter.format(
                        (props.result + props.result * tax) / 100,
                        {
                          code: _.toUpper(currency),
                        },
                      )}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    paddingVertical: 5,
  },
  noteStyle: {
    paddingHorizontal: 20,
    // justifyContent: 'flex-end',
    // flexDirection: 'row',
  },
  noteText: {
    color: Colors.primary,
    fontSize: 18,
    // paddingVertical: 2,
  },
});
