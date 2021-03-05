import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import Colors from '../../constants/Colors';
import CustomIconsComponent from '../CustomIcons';

const screen = Dimensions.get('window');

export default ({onPress, text, iconName, iconType}) => {
  const styles = StyleSheet.create({
    text: {
      color: Colors.primary,
      fontSize: 32,
    },
    textSecondary: {
      color: '#cecece',
    },
    button: {
      backgroundColor: Colors.white,
      flex: 1,
      height: screen.height / 9,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 4,
      borderRadius: 10,
      elevation: 2,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 2.62,
    },
    zeroButton: {
      minWidth: screen.width / 4,
    },
    addText: {
      color: Colors.white,
      fontSize: 22,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, text === '0' && styles.zeroButton]}>
      {text && <Text style={[styles.text]}>{text}</Text>}
      {iconType && iconName && (
        <CustomIconsComponent
          style={styles.iconStyle}
          type={iconType}
          color={Colors.primary}
          name={iconName}
          size={30}
        />
      )}
    </TouchableOpacity>
  );
};
