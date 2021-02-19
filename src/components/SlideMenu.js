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
import {useDispatch} from 'react-redux';

export default function SideMenu(props) {
  const [version, setVersion] = useState('');
  const [logoutLoader, setLogoutLoader] = useState(false);
  const dispatch = useDispatch();
  const menuOptions = [
    {
      screenName: 'Home',
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

  useEffect(() => {
    setVersion(DeviceInfo.getVersion());
  });

  navigateToScreen = async (route) => {
    props.navigation.dispatch(DrawerActions.closeDrawer());
    if (route) {
      if (route === 'Home') {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
        }}>
        <View style={styles.sideMenuContainer}>
          <View style={styles.sideMenuImageContainer}>
            <SvgImageViewer
              LocalIcon={LocalIcons.svgIconSet.logo}
              height={styles.logoStyle.height}
              width={styles.logoStyle.height}
            />
          </View>
          <View style={styles.menuListContainer} />
          {menuOptions.map((item, i) => {
            return (
              <TouchableOpacity
                onPress={() => navigateToScreen(item.screenName)}
                style={styles.menuItem}
                key={i}>
                <View style={styles.sideMenuListContainer}>
                  <View style={styles.sideMenuIconContainer}>
                    <CustomIconsComponent
                      style={[{textAlign: 'center'}]}
                      name={item.icon}
                      type={item.type ? item.type : 'FontAwesome'}
                      size={22}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.menuText}>{item.displayName}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        {logoutLoader ? (
          <ActivityIndicator style={{paddingLeft: 30}} size={18} />
        ) : (
          <TouchableOpacity
            onPress={() => logout()}
            style={styles.logoutContainer}>
            <CustomIconsComponent
              style={styles.logoutIcon}
              type={'SimpleLineIcons'}
              name={'logout'}
              color={Colors.greyText}
              size={21}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoStyle: {
    height: 130,
  },
  menuListContainer: {
    paddingVertical: 5,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#d0d0d0',
  },
  bottomContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideMenuImageContainer: {
    padding: 0,
    margin: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    backgroundColor: Colors.bgColor,
    alignItems: 'center',
  },
  sideMenuListContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sideMenuIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginRight: 10,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
  sideMenuLogoutIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
  versionContainer: {
    paddingRight: 20,
    paddingVertical: 6,
    fontSize: 16,
  },
  menuText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
});
