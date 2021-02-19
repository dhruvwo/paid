import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import currencyFormatter from 'currency-formatter';
import {tax, currency} from '../../constants/Default';

export default function History(props) {
  const styles = StyleSheet.create({
    noteStyle: {
      paddingHorizontal: 20,
      // justifyContent: 'flex-end',
      // flexDirection: 'row',
    },
    noteText: {
      color: Colors.primary,
      fontSize: 18,
      // paddingVertical: 2,
    },
  });

  return (
    <View style={{paddingVertical: 50, paddingHorizontal: 10}}>
      {props.history.map((val, i) => {
        return (
          <View key={i}>
            <View
              style={[
                GlobalStyles.row,
                {paddingVertical: 10, justifyContent: 'space-between'},
              ]}>
              <TouchableOpacity style={styles.noteStyle}>
                <Text style={styles.noteText}>Edit </Text>
              </TouchableOpacity>
              <Text style={{fontSize: 18}}>
                {val} + {(val * 3) / 100} = {val + (val * 3) / 100}
              </Text>
            </View>
            <View style={[GlobalStyles.row, {justifyContent: 'flex-end'}]}>
              {i > 0 && props.history.length - 1 === i && (
                <Text style={{fontSize: 24}}>
                  {' = ' +
                    currencyFormatter.format(
                      props.result + props.result * tax,
                      {
                        code: _.toUpper(currency),
                      },
                    )}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
