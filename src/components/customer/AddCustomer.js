import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import CustomIconsComponent from '../CustomIcons';
import {customerAction} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import * as _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ToastService from '../../services/Toast';

export default function AddCustomer(props) {
  const dispatch = useDispatch();
  const customerState = useSelector(({auth, customer}) => {
    return {
      auth,
      customer,
    };
  });
  const accountId =
    customerState?.auth?.userSetup?.payments?.stripeDetails?.accountId;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const addCustomer = async () => {
    setIsLoading(true);
    const customer = {
      accountId: accountId,
      address: null,
      email: data.email,
      metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        business_name: data.businessName,
      },
      name: data.businessName,
      phone: data.phone,
    };

    const response = await dispatch(customerAction.addCustomer(customer));
    if (response.status === 'success') {
      ToastService({
        message: response.message,
      });
      props.closeModal();
    } else {
      setError(response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAwareScrollView style={styles.mainContainer}>
      <TouchableOpacity onPress={() => props.closeModal()}>
        <CustomIconsComponent
          style={styles.iconStyle}
          name={'ios-close-outline'}
          size={40}
        />
      </TouchableOpacity>

      <View style={styles.container}>
        <CustomIconsComponent
          name={'user'}
          type={'FontAwesome'}
          color={Colors.greyText}
          size={100}
        />
        <Text style={styles.header}>Add Customer</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputLabel}
            underlineColorAndroid="transparent"
            placeholder="Business Name"
            value={data.businessName}
            onChangeText={(businessName) =>
              setData({...data, businessName: businessName})
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputLabel}
            underlineColorAndroid="transparent"
            placeholder="First Name*"
            value={data.firstName}
            onChangeText={(firstName) =>
              setData({...data, firstName: firstName})
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputLabel}
            underlineColorAndroid="transparent"
            placeholder="Last Name*"
            value={data.lastName}
            onChangeText={(lastName) => setData({...data, lastName: lastName})}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputLabel}
            keyboardType={'email-address'}
            underlineColorAndroid="transparent"
            placeholder="Email*"
            value={data.email}
            onChangeText={(email) => setData({...data, email: email.trim()})}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputLabel}
            keyboardType={'numeric'}
            underlineColorAndroid="transparent"
            placeholder="Phone"
            maxLength={10}
            value={data.phone}
            onChangeText={(phone) => setData({...data, phone: phone})}
          />
        </View>
        <View style={styles.errorContainer}>
          {error ? <Text style={styles.errorMessage}>{error}</Text> : <View />}
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[GlobalStyles.secondaryButtonContainer, styles.btnStyle]}
            onPress={() => addCustomer()}>
            {isLoading ? (
              <ActivityIndicator
                color={Colors.white}
                size={28}
                style={styles.loaderIcon}
              />
            ) : (
              <Text style={GlobalStyles.secondaryButtonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: Colors.bgColor,
    width: '100%',
  },
  container: {
    backgroundColor: Colors.white,
    marginVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  iconStyle: {
    padding: 8,
  },
  header: {
    color: Colors.primary,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loaderIcon: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginTop: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 15,
    borderColor: '#E4E1E1',
  },
  inputLabel: {
    minHeight: 50,
    height: 50,
    fontSize: 17,
    fontWeight: '700',
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    paddingVertical: 10,
  },
  errorMessage: {
    color: Colors.red,
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
  },
  btnStyle: {
    marginHorizontal: 10,
    width: '95%',
  },
});
