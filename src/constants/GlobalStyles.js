import {StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
const GlobalStyles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 30,
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonDisabledContainer: {
    opacity: 0.5,
    backgroundColor: Colors.grey,
  },
  secondaryButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 1,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  flexStyle: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});

export default GlobalStyles;
