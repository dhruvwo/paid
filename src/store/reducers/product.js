import {ProductState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  products: [],
};

export const product = (state = initialState, action) => {
  switch (action.type) {
    case ProductState.SET_PRODUCTS:
      return {
        products: action.data.products,
        totalProducts: action.data.totalProducts,
      };
    case ProductState.APPEND_PRODUCTS:
      const products = _.uniqBy([...state.products, ...action.data.products]);
      return {
        products,
        totalProducts: action.data.totalProducts,
      };
    default:
      return state;
  }
};
