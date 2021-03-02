import React, {useEffect} from 'react';
import {StyleSheet, ActivityIndicator, TextInput} from 'react-native';
import Colors from '../constants/Colors';
import * as _ from 'lodash';
import CustomIconsComponent from './CustomIcons';

export default function SearchComponent(props) {
  // console.log('invoice', props.invoice);
  useEffect(() => {}, []);

  return (
    <>
      <CustomIconsComponent
        style={styles.searchIcon}
        type={'AntDesign'}
        color={Colors.primary}
        name={'search1'}
      />
      <TextInput
        style={styles.searchInput}
        underlineColorAndroid="transparent"
        placeholder={props.placeholder || 'Search'}
        value={props.value}
        keyboardType={props.keyboardType || 'default'}
        autoCapitalize={'none'}
        autoCorrect={false}
        onChangeText={(txt) => props.onChangeText(txt)}
      />
      {props.isSearchLoading ? (
        <ActivityIndicator
          style={styles.searchIcon}
          size="small"
          color={Colors.primary}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  searchIcon: {
    padding: 12,
  },
  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
