import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {useSelector} from 'react-redux';

export default function Header(props) {
  const cartState = useSelector(({cart}) => {
    return {
      cart,
    };
  });

  return (
    <>
      <View style={styles.pageHeader}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.headerIconContainer}
            onPress={() => {
              props.navigation.openDrawer();
            }}>
            <CustomIconsComponent
              style={styles.menuIcon}
              type={'Ionicons'}
              name={'menu'}
              color={Colors.white}
              size={35}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>{props.title}</Text>
        </View>
        <TouchableOpacity onPress={() => props.navigation.navigate('Checkout')}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>
              {cartState.cart.products ? cartState.cart.products.length : 0}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.tertiary,
  },
  buttonsContainer: {
    width: 56,
  },
  headerIconContainer: {
    paddingVertical: 15,
  },
  menuIcon: {
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    color: Colors.white,
  },
  iconContainer: {
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingTop: 4,
    marginVertical: 16,
    marginHorizontal: 20,
    color: Colors.white,
    fontSize: 16,
  },
  iconText: {color: Colors.white, fontSize: 18, paddingBottom: 4},
});
