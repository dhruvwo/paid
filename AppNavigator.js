import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Colors from './src/constants/Colors';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import Login from './src/screens/Login';
import CalculatorScreen from './src/screens/Calculator';
import Checkout from './src/screens/Checkout';
import Invoice from './src/screens/Invoice';
import ProductList from './src/screens/ProductList';
import CustomIconsComponent from './src/components/CustomIcons';
import {StyleSheet, View} from 'react-native';
import SideMenu from './src/components/SlideMenu';
import {navigationRef, isReadyRef} from './src/RootNavigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const tabs = [
  {
    name: 'QuickPay',
    component: CalculatorScreen,
    iconType: 'Ionicons',
    focusedIconName: 'ios-calculator-outline',
    iconName: 'ios-calculator-outline',
  },
  {
    name: 'Products',
    component: ProductList,
    iconType: 'SimpleLineIcons',
    focusedIconName: 'social-dropbox',
    iconName: 'social-dropbox',
  },
];

const styles = StyleSheet.create({
  tabBarStyle: {
    // padding: 10,
  },
  tabBarLabelStyle: {
    // fontSize: 14,
  },
  tabNavigator: {
    minHeight: 40,
    // backgroundColor: Colors.headerBgGrey,
  },
});

function BottomTab() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: styles.tabNavigator,
      }}>
      {tabs.map((tab) => {
        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={[styles.tabIcon]}>
                  <CustomIconsComponent
                    type={tab.iconType}
                    color={focused ? Colors.primary : Colors.greyText}
                    name={focused ? tab.focusedIconName : tab.iconName}
                    size={30}
                  />
                </View>
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName={'BottomTab'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Checkout" component={Checkout} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <SideMenu {...props} />}>
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Invoices" component={Invoice} />
    </Drawer.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      <Stack.Navigator initialRouteName={'AuthLoading'}>
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
