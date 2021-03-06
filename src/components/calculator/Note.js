import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalStyles from '../../constants/GlobalStyles';
import * as _ from 'lodash';
import Header from '../Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function Note(props) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(props.note);
  }, [props]);

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => {
        props.closeModal(note);
        setNote('');
      }}>
      <SafeAreaView style={GlobalStyles.flexStyle}>
        <Header
          navigation={props.navigation}
          title="Note"
          close={() => {
            props.closeModal(note);
            setNote('');
          }}
        />
        <KeyboardAwareScrollView
          style={GlobalStyles.flexStyle}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.noteContainer}
            multiline={true}
            placeholder="Note"
            textAlignVertical={'center'}
            value={note}
            onChangeText={(note) => setNote(note)}
          />
          <TouchableOpacity
            style={[GlobalStyles.secondaryButtonContainer, styles.btnStyle]}
            onPress={() => {
              props.closeModal(note);
              setNote('');
            }}>
            <Text style={GlobalStyles.secondaryButtonText}>Save</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bgColor,
    justifyContent: 'space-between',
  },
  iconStyle: {
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  noteContainer: {
    borderRadius: 10,
    margin: 10,
    padding: 20,
    minHeight: 200,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  btnStyle: {
    borderRadius: 0,
  },
});
