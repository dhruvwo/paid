import {combineReducers} from 'redux';
import {auth} from './auth';
import {product} from './product';

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
  product,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
