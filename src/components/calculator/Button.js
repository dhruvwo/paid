import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import Colors from '../../constants/Colors';

const screen = Dimensions.get('window');
const buttonWidth = screen.width / 4;

export default ({onPress, text, size, theme}) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text(text)];

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
      <Text style={textStyles}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: (text) => ({
    color: Colors.primary,
    fontSize: 32,
    // borderWidth: text === '+' ? 1 : 0,
    // borderColor: text === '+' ? Colors.primary : Colors.white,
    // borderRadius: text === '+' ? 60 : 0,
    // paddingHorizontal: text === '+' ? 30 : 0,
    // paddingVertical: text === '+' ? 10 : 0,
  }),
  textSecondary: {
    color: '#cecece',
  },
  button: {
    backgroundColor: Colors.white,
    flex: 1,
    height: screen.width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  buttonDouble: {
    width: screen.width / 2 - 10,
    flex: 0,
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
});
