import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomIconsComponent from '../CustomIcons';
import GlobalStyles from '../../constants/GlobalStyles';

export default function Note(props) {
  const styles = StyleSheet.create({
    noteStyle: {
      padding: 12,
      flexDirection: 'row',
    },
    noteText: {
      color: Colors.primary,
      fontSize: 14,
      paddingVertical: 2,
    },
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.greyText,
        borderRadius: 50,
        paddingHorizontal: 20,
      }}>
      <View style={GlobalStyles.row}>
        <CustomIconsComponent
          style={styles.iconStyle}
          type={'SimpleLineIcons'}
          color={Colors.grey}
          size={20}
          name={'note'}
        />
        <TextInput
          style={styles.inputLabel}
          underlineColorAndroid="transparent"
          placeholder="Rembember me"
          // value={note}
          // onChangeText={(note) => setNote(note)}
        />
      </View>
      <TouchableOpacity style={styles.noteStyle}>
        <Text style={styles.noteText}>Note</Text>
      </TouchableOpacity>
    </View>
  );
}
