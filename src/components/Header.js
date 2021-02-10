import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import CustomIconsComponent from '../components/CustomIcons';

export default function Header(props) {
  return (
    <>
      <View style={styles.pageHeader}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.headerIconContainer}
            onPress={() => {
              props.navigation.openDrawer();
            }}>
            <CustomIconsComponent
              style={styles.menuIcon}
              type={'Ionicons'}
              name={'menu'}
              color={'black'}
              size={35}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          {props.result ? (
            <>
              <Text style={styles.headerText}>Current Sale</Text>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 4,
                  //   padding: 10,
                  paddingHorizontal: 4,
                  position: 'absolute',
                  right: 76,
                }}>
                <Text>1</Text>
              </View>
              <View
                style={{
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderRadius: 4,
                  padding: 12,
                  marginTop: 6,
                  position: 'relative',
                  right: 0,
                }}></View>
            </>
          ) : (
            <Text style={styles.headerText}>No Sale</Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    // width: '100%',
    flexDirection: 'row',
    // paddingVertical: Layout.window.height > 700 ? 10 : 5,
  },
  buttonsContainer: {
    width: 56,
  },
  headerIconContainer: {
    paddingVertical: 15,
    // paddingLeft: 16,
  },
  menuIcon: {
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 35,
  },
  headerText: {
    fontSize: 22,
    // fontWeight: 'bold',
    paddingHorizontal: 6,
  },
});
