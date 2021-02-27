import {ProductState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  products: [],
  totalProducts: 0,
};

export const product = (state = initialState, action) => {
  switch (action.type) {
    case ProductState.SET_PRODUCTS:
      return {
        products: _.uniqBy(action.data.products, 'id'),
        totalProducts: action.data.totalProducts,
      };
    case ProductState.APPEND_PRODUCTS:
      const products = _.uniqBy(
        [...state.products, ...action.data.products],
        'id',
      );
      return {
        products,
        totalProducts: action.data.totalProducts,
      };
    case ProductState.CLEAR_PRODUCTS:
      return initialState;
    default:
      return state;
  }
};
