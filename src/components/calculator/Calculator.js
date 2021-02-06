import React, {useState, useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import Button from './Button';
import * as _ from 'lodash';

export default function CalculatorComponent(props) {
    const [currVal, setCurrVal] = useState(0);

    const [history, setHistory] = useState([]);
    const [result, setResult] = useState(0);
    const tax = '3';

    const handleTap = (type, value) => {
        if (type === "number") {
            setCurrVal(`${currVal}${value}`);
        }

        if (type === "operator") {
            // setOperator(value);
            let historyArr = _.cloneDeep(history)
            const current = parseFloat(currVal);
            console.log('current = ', current);
            historyArr.push(current)
            setHistory(historyArr);

        }

        if (type === "clear") {
            setCurrVal(0);
            // setOperator(null);
            // setPrevVal(null);
            setHistory([])
            setResult(0);

        }

        console.log('value : ', value);


    }


    useEffect(() => {
        if (history.length) {

            // const current = parseFloat(currVal);
            console.log('history --> ', history);
            var sum = history.reduce(function (a, b) {
                return (parseFloat(a) + parseFloat(b));
            }, 0);
            console.log('total --> ', sum);
            setResult(sum);
            // setPrevVal(current);
            setCurrVal(0)
        }

    }, [history]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            <SafeAreaView>
                <View style={styles.row}>
                <Text style={styles.value}>{result + (result * tax)/100}</Text>
                </View>
                <Text style={styles.value}>{currVal}</Text>

                <View style={styles.row}>
                    <Button text="1" onPress={() => handleTap("number", 1)}/>
                    <Button text="2" onPress={() => handleTap("number", 2)}/>
                    <Button text="3" onPress={() => handleTap("number", 3)}/>
                </View>

                <View style={styles.row}>
                    <Button text="4" onPress={() => handleTap("number", 4)}/>
                    <Button text="5" onPress={() => handleTap("number", 5)}/>
                    <Button text="6" onPress={() => handleTap("number", 6)}/>
                </View>

                <View style={styles.row}>
                    <Button text="7" onPress={() => handleTap("number", 7)}/>
                    <Button text="8" onPress={() => handleTap("number", 8)}/>
                    <Button text="9" onPress={() => handleTap("number", 9)}/>
                </View>
                <View style={styles.row}>
                    <Button text="C" theme="secondary" onPress={() => handleTap("clear")}/>
                    <Button text="0" onPress={() => handleTap("number", 0)}/>
                    <Button text="+" theme="accent" onPress={() => handleTap("operator", "+")}/>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#202020',
        justifyContent: "flex-end",
    },
    row: {
        flexDirection: 'row'
    },
    value: {
        color: "#fff",
        fontSize: 40,
        textAlign: "right",
        marginRight: 20,
        marginBottom: 10,
    }
});