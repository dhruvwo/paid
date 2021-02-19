import {CartState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  products: [],
};

export const cart = (state = initialState, action) => {
  switch (action.type) {
    case CartState.ADD_PRODUCT:
      const products = _.uniqBy([...state.products, action.data]);
      return {
        products,
      };
    case CartState.UPDATE_CART:
      const productIndex = _.findIndex(state.products, {id: action.data.id});
      let data = [...state.products];
      data[productIndex] = action.data;
      return {
        products: [...data],
      };
    case CartState.REMOVE_PRODUCT:
      const productData = _.remove(state.products, function (val) {
        return val.id !== action.data;
      });
      return {
        products: [...productData],
      };
    case CartState.CLEAR_CART:
      return {
        products: [],
      };
    default:
      return state;
  }
};
