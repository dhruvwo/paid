import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {useSelector} from 'react-redux';

export default function Header(props) {
  const cartState = useSelector(({cart}) => cart);

  return (
    <View style={styles.pageHeader(props.showMenu)}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.headerIconContainer}
          onPress={() => {
            props.showMenu ? props.navigation.openDrawer() : props.close();
          }}>
          <CustomIconsComponent
            type={props.showMenu ? 'AntDesign' : 'MaterialIcons'}
            name={props.showMenu ? 'menu-unfold' : 'arrow-back-ios'}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {props.showCheckout && (
          <TouchableOpacity
            style={styles.headerIconContainer}
            onPress={() => {
              props.navigation.navigate('Checkout');
            }}>
            <CustomIconsComponent
              style={styles.checkOutIcon}
              name={'money-check-alt'}
              type={'FontAwesome5'}
              color={Colors.white}
            />
            {cartState.items.length ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartState.items.length}</Text>
              </View>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: (showMenu) => ({
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    width: '100%',
  }),
  buttonsContainer: {
    minWidth: 60,
  },
  headerIconContainer: {
    padding: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 8,
    padding: 4,
    minHeight: 12,
    width: 'auto',
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
