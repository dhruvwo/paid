import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Colors from './src/constants/Colors';
import {StyleSheet} from 'react-native';
import Login from './src/screens/Login';
import CalculatorScreen from './src/screens/Calculator';
import Checkout from './src/screens/Checkout';
import Invoice from './src/screens/Invoice';
import ProductList from './src/screens/ProductList';
import CustomIconsComponent from './src/components/CustomIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const tabs = [
  {
    name: 'Calculator',
    component: CalculatorScreen,
  },
  {
    name: 'Products',
    component: ProductStack,
  },
];

const styles = StyleSheet.create({
  tabIcon: {
    opacity: 0.5,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabNavigator: {
    backgroundColor: Colors.headerBgGrey,
  },
});

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let type;
          if (route.name === 'Quick Pay') {
            iconName = focused ? 'rocket-launch' : 'rocket-launch-outline';
            type = 'MaterialCommunityIcons';
          } else if (route.name === 'Products') {
            iconName = focused ? 'align-left' : 'align-left';
            type = 'Feather';
          }

          // You can return any component that you like here!
          return (
            <CustomIconsComponent
              type={type}
              name={iconName}
              size={30}
              color={color}
            />
          );
        },
      })}
      tabBarOptions={{
        style: {
          padding: 10,
        },
        activeTintColor: Colors.primary,
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 14,
        },
      }}>
      <Tab.Screen name="Quick Pay" component={CalculatorScreen} />
      <Tab.Screen name="Products" component={ProductList} />
    </Tab.Navigator>
  );
}

function ProductStack() {
  return (
    <Stack.Navigator
      initialRouteName={'ProductList'}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="ProductList" component={ProductList} />
      <Tab.Screen name="Checkout" component={Checkout} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={BottomTab} />
      <Drawer.Screen name="Invoices" component={Invoice} />
      <Drawer.Screen name="Logout" component={BottomTab} />
    </Drawer.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'}>
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
