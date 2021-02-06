import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("window");
const buttonWidth = screen.width / 4;

export default ({ onPress, text, size, theme }) => {
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];

    if(size == "double") {
        buttonStyles.push(styles.buttonDouble)
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

    )};

const styles = StyleSheet.create({
    text: {
        color: "#fff",
        fontSize: 25
    },
    textSecondary: {
        color: "#cecece"
    },
    button: {
        backgroundColor: "#a6a6a6",
        flex: 1,
        height: screen.width / 4,
        alignItems: "center",
        justifyContent: "center",
        margin: 1
    },
    buttonDouble: {
        width: screen.width / 2 -10,
        flex: 0,
        alignItems: "flex-start",
        paddingLeft: 40
    }
});