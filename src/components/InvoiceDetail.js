import React, {useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import GlobalStyles from '../constants/GlobalStyles';
import * as _ from 'lodash';

const screenHeight = Dimensions.get('window').height;

export default function InvoiceDetailModal(props) {
  // console.log('invoice', props.invoice);
  useEffect(() => {}, []);

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => {
        props.closeModal();
      }}>
      <SafeAreaView style={GlobalStyles.flexStyle}>
        <Header
          navigation={props.navigation}
          title={props.invoice.name}
          close={() => props.closeModal()}
        />
        <ScrollView contentContainerStyle={styles.modalContainer}></ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({});
