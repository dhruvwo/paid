import {StyleSheet} from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
  },
});
