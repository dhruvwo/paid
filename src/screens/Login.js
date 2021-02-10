import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import SvgImageViewer from '../components/SvgImageViewer';
import LocalIcons from '../constants/LocalIcons';
import CustomIconsComponent from '../components/CustomIcons';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginLoader, setIsLoginLoader] = useState(false);

  const notInplement = () => {
    return Alert.alert(``, `Not Implemented Yet!`, [
      {
        text: 'Close',
        style: 'cancel',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        extraScrollHeight={120}
        style={GlobalStyles.flexStyle}
        contentContainerStyle={styles.scrollContainerStyle}
        keyboardShouldPersistTaps="handled">
        <SvgImageViewer
          style={styles.logoStyle}
          LocalIcon={LocalIcons.svgIconSet.logo}
          height={styles.logoStyle.height}
          width={styles.logoStyle.height}
        />
        <View style={styles.modalContainer}>
          <View style={styles.inputContainer}>
            <CustomIconsComponent
              style={styles.inputIcon}
              type={'MaterialCommunityIcons'}
              color={Colors.primary}
              name={'email-outline'}
            />
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              keyboardType={'email-address'}
              style={styles.inputLabel}
              underlineColorAndroid="transparent"
              value={email}
              placeholder="Email*"
              onChangeText={(email) => setEmail(email.trim())}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomIconsComponent
              style={styles.inputIcon}
              type={'MaterialCommunityIcons'}
              color={Colors.primary}
              name={'form-textbox-password'}
            />
            <TextInput
              style={styles.inputLabel}
              underlineColorAndroid="transparent"
              placeholder="Password*"
              value={password}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <View style={styles.errorContainer}>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : (
              <View />
            )}
          </View>
          <TouchableOpacity onPress={() => notInplement()}>
            <View style={styles.loginContainer}>
              <Text style={styles.touchableText}>{'Forgot Password ?'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[GlobalStyles.buttonContainer, styles.buttonContainer]}
            onPress={() => props.navigation.replace('DrawerNavigator')}>
            {isLoginLoader ? (
              <ActivityIndicator
                color={Colors.white}
                size={28}
                style={styles.loaderIcon}
              />
            ) : (
              <View>
                <Text style={GlobalStyles.buttonText}>{'Login'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.containerText}>Don't have an account ?</Text>
          <TouchableOpacity onPress={() => notInplement()}>
            <View style={styles.loginContainer}>
              <Text style={GlobalStyles.secondaryButtonText}>{'Sign up'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    flex: 1,
  },
  logoStyle: {
    paddingVertical: 120,
    height: 150,
  },
  scrollContainerStyle: {
    flexGrow: 1,
  },
  modalContainer: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    position: 'relative',
  },
  inputContainer: {
    marginTop: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    borderColor: '#E4E1E1',
  },
  inputIcon: {
    paddingTop: 18,
    paddingHorizontal: 10,
  },
  inputLabel: {
    minHeight: 50,
    height: 50,
    fontSize: 17,
    fontWeight: '700',
    paddingBottom: 0,
    flexGrow: 1,
    flexShrink: 1,
  },
  loginContainer: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loaderIcon: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  touchableText: {
    color: Colors.primary,
    fontSize: 16,
  },
  containerText: {
    color: Colors.greyText,
    fontSize: 18,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  errorContainer: {
    paddingVertical: 10,
  },
  errorMessage: {
    color: Colors.red,
    // paddingTop: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    alignSelf: 'flex-end',
    alignSelf: 'center',
    position: 'absolute',
    bottom: -35,
  },
  signUpContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 50,
    // justifyContent: 'flex-end',
    // backgroundColor: 'red',
  },
});
