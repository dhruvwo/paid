import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import Colors from '../../constants/Colors';
import CustomIconsComponent from '../CustomIcons';

const screen = Dimensions.get('window');

export default ({onPress, text, size, iconName, iconType, theme}) => {
  const buttonStyles = [styles.button(text)];
  const textStyles = [styles.text];

  if (size == 'double') {
    buttonStyles.push(styles.buttonDouble);
  }

  // if(theme == "secondary") {
  //     buttonStyles.push(styles.buttonSecondary);
  //     textStyles.push(styles.textSecondary);
  // } else if(theme == "accent") {
  //     buttonStyles.push(styles.buttonAccent);
  // }

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      {text && <Text style={textStyles}>{text}</Text>}
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

const styles = StyleSheet.create({
  text: {
    color: Colors.primary,
    fontSize: 32,
  },
  textSecondary: {
    color: '#cecece',
  },
  button: (text) => ({
    backgroundColor: Colors.white,
    flex: 1,
    // height: text === 'AC' ? screen.height / 4 : screen.height / 9,
    height: screen.height / 9,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderRadius: 10,
    elevation: 2,
  }),
  buttonDouble: {
    width: screen.width / 2 - 10,
    flex: 0,
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
});
