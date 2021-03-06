import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import {customerAction} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import * as _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ToastService from '../../services/Toast';
import Header from '../Header';

export default function AddCustomer(props) {
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const accountId = authState?.userSetup?.payments?.stripeDetails?.accountId;
  const [isEmailBlur, setIsEmailBlur] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const isValid = !!(data.firstName && data.lastName && data.email);
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

  const fnChangeEmail = (val) => {
    if (isEmailBlur || val) {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          val.trim(),
        )
      ) {
        setIsEmailValid(false);
      } else {
        setIsEmailValid(true);
      }
    }
    setData({...data, email: val.trim()});
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => {
        props.closeModal();
      }}>
      <SafeAreaView style={GlobalStyles.flexStyle}>
        <Header
          navigation={props.navigation}
          title="Add Customer"
          close={() => props.closeModal()}
        />
        <KeyboardAwareScrollView
          style={GlobalStyles.flexStyle}
          contentContainerStyle={styles.mainContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
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
                onChangeText={(lastName) =>
                  setData({...data, lastName: lastName})
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputLabel}
                keyboardType={'email-address'}
                underlineColorAndroid="transparent"
                placeholder="Email*"
                autoCapitalize={'none'}
                value={data.email}
                onBlur={() => setIsEmailBlur(true)}
                onChangeText={(email) => fnChangeEmail(email)}
              />
            </View>
            {isEmailBlur && !isEmailValid ? (
              <Text style={styles.errorMessage}>Valid Email is required</Text>
            ) : (
              <View />
            )}
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
              {error ? (
                <Text style={styles.errorMessage}>{error}</Text>
              ) : (
                <View />
              )}
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                disabled={!(isValid && isEmailValid) || isLoading}
                style={[
                  GlobalStyles.secondaryButtonContainer,
                  isValid && isEmailValid
                    ? ''
                    : GlobalStyles.buttonDisabledContainer,
                  styles.btnStyle,
                ]}
                onPress={() => addCustomer()}>
                {isLoading ? (
                  <ActivityIndicator
                    color={Colors.white}
                    size={25}
                    style={styles.loaderIcon}
                  />
                ) : (
                  <Text style={GlobalStyles.secondaryButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  loaderIcon: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginTop: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 15,
    borderColor: '#E4E1E1',
  },
  inputLabel: {
    minHeight: 50,
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
