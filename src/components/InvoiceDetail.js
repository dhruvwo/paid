import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import Header from '../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';
import currencyFormatter from 'currency-formatter';
import {cartAction} from '../store/actions';
import {currency} from '../constants/Default';

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
      <Header
        navigation={props.navigation}
        title={props.invoice.name}
        close={() => props.closeModal()}
      />
      <ScrollView contentContainerStyle={styles.modalContainer}></ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({});
