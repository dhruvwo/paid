import {CartState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  products: [],
  quickPay: [],
};

export const cart = (state = initialState, action) => {
  switch (action.type) {
    case CartState.ADD_PRODUCT:
      const products = _.uniqBy([...state.products, action.data]);
      return {
        ...state,
        products,
      };
    case CartState.UPDATE_CART:
      const productIndex = _.findIndex(state.products, {id: action.data.id});
      let data = [...state.products];
      data[productIndex] = action.data;
      return {
        ...state,
        products: [...data],
      };
    case CartState.REMOVE_PRODUCT:
      const productData = _.remove(state.products, function (val) {
        return val.id !== action.data;
      });
      return {
        ...state,
        products: [...productData],
      };
    case CartState.CLEAR_CART:
      return {
        ...state,
        products: [],
      };
    case CartState.ADD_QUICKPAY:
      const quickPay = _.uniqBy([...state.quickPay, action.data]);
      return {
        ...state,
        quickPay,
      };
    case CartState.REMOVE_QUICKPAY:
      const payData = _.remove(state.quickPay, function (val) {
        return val.id !== action.data;
      });
      return {
        ...state,
        quickPay: [...payData],
      };
    case CartState.CLEAR_QUICKPAY:
      return {
        ...state,
        quickPay: [],
      };
    default:
      return state;
  }
};
