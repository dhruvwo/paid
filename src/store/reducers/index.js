import {combineReducers} from 'redux';
import {auth} from './auth';
import {product} from './product';
import {invoice} from './invoice';
import {cart} from './cart';
import {customer} from './customer';

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
  product,
  invoice,
  cart,
  customer,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
