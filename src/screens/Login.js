import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import SvgImageViewer from '../components/SvgImageViewer';
import LocalIcons from '../constants/LocalIcons';
import CustomIconsComponent from '../components/CustomIcons';
import {authAction} from '../store/actions/auth';

export default function Login(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(''); //hofel64825@agilekz.com
  const [password, setPassword] = useState(''); //Paid123!
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginLoader, setIsLoginLoader] = useState(false);
  const [secure, setSecure] = useState(true);

  const notInplement = () => {
    return Alert.alert(``, `Coming soon.`, [
      {
        text: 'Close',
        style: 'cancel',
      },
    ]);
  };

  const onSubmit = async () => {
    setIsLoginLoader(true);
    await dispatch(authAction.getServiceKey());
    const loginData = await dispatch(authAction.login(email, password));
    if (loginData?.status === 'success') {
      await dispatch(authAction.getUserSetup());
      setIsLoginLoader(false);
      props.navigation.replace('DrawerNavigator');
    } else if (loginData?.data?.status === 'failed') {
      setErrorMessage(loginData.data.error);
    } else if (loginData?.status === 'failed') {
      setErrorMessage(loginData.data.error || loginData.error);
    }
    setIsLoginLoader(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraScrollHeight={120}
        style={GlobalStyles.flexStyle}
        contentContainerStyle={styles.scrollContainerStyle}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled">
        {/* <View style={styles.headerContainer}>
          <LinearGradient
            start={{x: 0.3, y: 0}}
            end={{x: 1, y: 0}}
            colors={[Colors.primary, Colors.secondary]}
            style={styles.headerColorContainer}></LinearGradient>
          <LinearGradient
            start={{x: 0.6, y: 0}}
            end={{x: 1, y: 0}}
            colors={[Colors.primary, Colors.secondary]}
            style={styles.headerColorSecondaryContainer}></LinearGradient>
        </View> */}
        <SvgImageViewer
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
              type={'AntDesign'}
              color={Colors.primary}
              name={'lock'}
              size={27}
            />
            <TextInput
              style={[styles.inputLabel, styles.passwordText]}
              underlineColorAndroid="transparent"
              placeholder="Password*"
              value={password}
              onSubmitEditing={() => onSubmit()}
              secureTextEntry={secure}
              onChangeText={(password) => setPassword(password)}
            />
            {password ? (
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => setSecure(!secure)}>
                {secure ? (
                  <CustomIconsComponent
                    style={styles.passwordIcon}
                    type={'Ionicons'}
                    color={Colors.grey}
                    name={'ios-eye-off-outline'}
                    size={20}
                  />
                ) : (
                  <CustomIconsComponent
                    style={styles.passwordIcon}
                    type={'Ionicons'}
                    color={Colors.grey}
                    name={'ios-eye-outline'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.errorContainer}>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : (
              <View />
            )}
          </View>
          <TouchableOpacity
            style={[
              GlobalStyles.secondaryButtonContainer,
              styles.buttonContainer,
              !(email && password) ? GlobalStyles.buttonDisabledContainer : '',
            ]}
            disabled={!(email && password) || isLoginLoader}
            onPress={() => onSubmit()}>
            {isLoginLoader ? (
              <ActivityIndicator
                color={Colors.white}
                size={20}
                style={styles.loaderIcon}
              />
            ) : (
              <Text
                style={[GlobalStyles.secondaryButtonText, styles.loginText]}>
                Login
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {/* <LinearGradient
          start={{x: 0.4, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            GlobalStyles.buttonContainer,
            styles.buttonContainer,
            !email && !password ? {opacity: 0.6} : '',
          ]}
          colors={[Colors.primary, Colors.secondary]}> */}
        {/* <TouchableOpacity
          style={[
            GlobalStyles.secondaryButtonContainer,
            styles.buttonContainer,
            !email && !password ? {opacity: 0.6} : '',
          ]}
          disabled={!email && !password}
          onPress={() => onSubmit()}>
          {isLoginLoader ? (
            <ActivityIndicator
              color={Colors.white}
              size={25}
              style={styles.loaderIcon}
            />
          ) : (
            <View>
              <Text
                style={[GlobalStyles.secondaryButtonText, styles.loginText]}>
                {'Login'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        </LinearGradient> */}
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => notInplement()}>
            <View style={styles.loginContainer}>
              <Text style={styles.touchableText}>Forgot Password?</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.containerText}>Don't have an account?</Text>
            <TouchableOpacity
              style={styles.signUpText}
              onPress={() => notInplement()}>
              <Text style={GlobalStyles.buttonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{flex: 2, flexDirection: 'row-reverse'}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0.5, y: 0}}
            colors={[Colors.secondary, Colors.primary]}
            style={styles.bottomColorContainer}></LinearGradient>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0.5, y: 0}}
            colors={[Colors.secondary, Colors.primary]}
            style={styles.bottomColorSecondaryContainer}></LinearGradient>
        </View> */}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColor,
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '30%',
  },
  headerColorContainer: {
    height: '100%',
    width: '55%',
    borderTopRightRadius: 500,
    borderBottomRightRadius: 500,
    paddingTop: 100,
    zIndex: 1,
    position: 'relative',
  },
  headerColorSecondaryContainer: {
    height: '50%',
    width: '100%',
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
    opacity: 0.8,
    position: 'absolute',
    left: 18,
  },
  bottomColorContainer: {
    height: '80%',
    width: '12%',
    padding: 20,
    marginTop: 40,
    borderBottomLeftRadius: 500,
    borderTopLeftRadius: 500,
    zIndex: 1,
    position: 'relative',
    bottom: 0,
  },
  bottomColorSecondaryContainer: {
    height: '30%',
    width: '18%',
    borderTopLeftRadius: 500,
    borderTopRightRadius: 500,
    opacity: 0.8,
    position: 'absolute',
    left: 15,
    bottom: 0,
  },
  logoStyle: {
    height: 150,
  },
  scrollContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flexDirection: 'column',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 6,
    elevation: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  inputContainer: {
    marginTop: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    borderColor: '#E4E1E1',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  passwordIcon: {
    paddingHorizontal: 10,
  },
  inputLabel: {
    minHeight: 50,
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 0,
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
  loginContainer: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loaderIcon: {
    backgroundColor: 'transparent',
  },
  touchableText: {
    color: Colors.primary,
    fontSize: 16,
    paddingBottom: 10,
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
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    alignSelf: 'flex-end',
    alignSelf: 'center',
    width: '90%',
    borderWidth: 0,
    height: 42,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  signUpText: {
    justifyContent: 'center',
  },
  forgotPasswordContainer: {paddingTop: 40},
});
