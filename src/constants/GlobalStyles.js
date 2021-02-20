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
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    backgroundColor: Colors.primary,
    elevation: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  secondaryButtonText: {
    color: Colors.white,
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
