import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DrawerActions} from '@react-navigation/drawer';
// import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationActions, StackActions} from '@react-navigation/native';
import * as _ from 'lodash';
import CustomIconsComponent from './CustomIcons';
import Colors from '../constants/Colors';
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
    // setVersion(DeviceInfo.getVersion());
  });

  navigateToScreen = (route) => async () => {
    props.navigation.dispatch(DrawerActions.closeDrawer());
    if (route) {
      if (route === 'Home') {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'DrawerNavigator'})],
        });
        props.navigation.dispatch(resetAction);
      }
      if (route === 'Invoice') {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'DrawerNavigator'})],
        });
        props.navigation.dispatch(resetAction);
        props.navigation.navigate('Invoice', {route});
        return;
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
            {/* <SvgImageViewer
              LocalIcon={LocalIcons.svgIconSet}
              height={45}
              width={140}
            /> */}
          </View>
          <View style={styles.menuListContainer} />
          {menuOptions.map((item, i) => {
            return (
              <TouchableOpacity
                onPress={() => navigateToScreen(item.screenName)}
                style={styles.menuItem}
                key={i}>
                <View style={styles.sideMenuIconContainer}>
                  {item.iconName ? (
                    // <SvgImageViewer
                    //   LocalIcon={item.iconName}
                    //   height={22}
                    //   width={22}
                    // />
                    <></>
                  ) : (
                    <CustomIconsComponent
                      style={[{textAlign: 'center'}]}
                      name={item.icon}
                      type={item.type ? item.type : 'FontAwesome'}
                      size={22}
                      color={Colors.greyText}
                    />
                  )}
                </View>
                <Text style={styles.menuText}>{item.displayName}</Text>
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
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* <SvgImageViewer
              style={[styles.sideMenuLogoutIcon]}
              LocalIcon={LocalIcons.svgIconSet.logout}
              height={22}
              width={22}
            /> */}
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
    paddingHorizontal: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  menuListContainer: {
    // paddingVertical: 10,
    // width: 290,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#d0d0d0',
  },
  bottomContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // minHeight: 50,
    alignItems: 'center',
  },
  sideMenuImageContainer: {
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    // minHeight: 50,
    // alignItems: 'flex-start',
    // justifyContent: 'flex-end',
    // backgroundColor: Colors.bgColor,
    // alignItems: 'center',
    // width: 290,
  },
  sideMenuIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // marginLeft: 35,
    // marginRight: 10,
    marginVertical: 2,
  },
  sideMenuLogoutIcon: {
    width: 30,
    height: 30,
    // marginLeft: 35,
    // marginRight: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
  versionContainer: {
    paddingRight: 10,
    paddingVertical: 6,
    fontSize: 16,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
});
