import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  NavigationActions,
  StackActions,
  DrawerActions,
} from '@react-navigation/native';
import * as _ from 'lodash';
import CustomIconsComponent from './CustomIcons';
import Colors from '../constants/Colors';
import LocalIcons from '../constants/LocalIcons';
import SvgImageViewer from '../components/SvgImageViewer';
import {authAction} from '../store/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import {FileLogger} from 'react-native-file-logger';
import moment from 'moment';

export default function SideMenu(props) {
  const authState = useSelector(({auth}) => ({
    auth,
  }));
  const [logoutLoader, setLogoutLoader] = useState(false);
  const dispatch = useDispatch();
  const menuOptions = [
    {
      screenName: 'BottomTab',
      icon: 'rocket-launch',
      type: 'MaterialCommunityIcons',
      displayName: 'Home',
    },
    {
      screenName: 'Invoices',
      icon: 'file-invoice',
      type: 'FontAwesome5',
      displayName: 'Invoice',
    },
  ];

  const navigateToScreen = async (route) => {
    props.navigation.dispatch(DrawerActions.closeDrawer());
    if (route) {
      if (route === 'BottomTab') {
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [NavigationActions.navigate({routeName: 'DrawerNavigator'})],
        // });
        // props.navigation.dispatch(resetAction);
      }
      if (route === 'Invoice') {
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [NavigationActions.navigate({routeName: 'DrawerNavigator'})],
        // });
        // props.navigation.dispatch(resetAction);
        // props.navigation.navigate('Invoice', {route});
      }
      props.navigation.navigate(route);
    }
  };

  logout = async () => {
    setLogoutLoader(true);
    await dispatch(authAction.logout());
    setLogoutLoader(false);
    props.navigation.navigate('Login');
  };

  const sendLog = () => {
    FileLogger.sendLogFilesByEmail(
      (Option = {
        to: 'vaishali.webosmotic@gmail.com',
        subject: 'Log file of paid',
        body: `Log of paid app at ${moment().format(
          'YYYY-MM-DD HH:mm:ss',
        )} by ${authState?.auth?.authenticationResponse?.email}.`,
      }),
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SvgImageViewer
        style={styles.imageContainer}
        LocalIcon={LocalIcons.svgIconSet.logo}
        height={styles.logoStyle.height}
        width={styles.logoStyle.height}
      />
      <ScrollView
        style={GlobalStyles.flexStyle}
        contentContainerStyle={styles.menuListContainer}>
        {menuOptions.map((item, i) => {
          return (
            <TouchableOpacity
              onPress={() => navigateToScreen(item.screenName)}
              style={styles.menuItemContainer}
              key={i}>
              <CustomIconsComponent
                style={styles.menuIconContainer}
                name={item.icon}
                type={item.type ? item.type : 'FontAwesome'}
                size={22}
                color={Colors.primary}
              />
              <Text style={styles.menuText}>{item.displayName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => sendLog()}
          style={styles.menuItemContainer}>
          <Text style={styles.menuText}>Send log</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        {logoutLoader ? (
          <ActivityIndicator
            style={styles.loaderIcon}
            size={18}
            color={Colors.primary}
          />
        ) : (
          <TouchableOpacity
            onPress={() => logout()}
            style={styles.menuItemContainer}>
            <CustomIconsComponent
              style={styles.menuIconContainer}
              type={'SimpleLineIcons'}
              name={'logout'}
              color={Colors.greyText}
              size={22}
            />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        )}
        {version ? (
          <View style={styles.versionContainer}>
            <Text>v {version}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    padding: 0,
    margin: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    backgroundColor: Colors.bgColor,
    alignItems: 'center',
  },
  logoStyle: {
    height: 130,
  },
  menuListContainer: {
    flexGrow: 1,
    padding: 20,
  },
  menuItemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  menuIconContainer: {
    width: 25,
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.greyText,
    justifyContent: 'center',
  },
  bottomContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loaderIcon: {paddingLeft: 30},
  versionContainer: {
    justifyContent: 'center',
    fontSize: 16,
  },
});
