import {CartState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  items: [],
};

export const cart = (state = initialState, action) => {
  switch (action.type) {
    case CartState.ADD_ITEM:
      const items = _.uniqBy([...state.items, action.data]);
      return {
        ...state,
        items,
      };
    case CartState.UPDATE_ITEM:
      const productIndex = _.findIndex(state.items, {id: action.data.id});
      let data = [...state.items];
      data[productIndex] = action.data;
      return {
        ...state,
        items: data,
      };
    case CartState.REMOVE_ITEM:
      const productData = _.remove(state.items, function (val) {
        return val.id !== action.data;
      });
      return {
        ...state,
        items: [...productData],
      };
    case CartState.CLEAR_ITEMS:
      let newItems = [];
      if (action.data && action.data === 'onlyCalc' && state.items) {
        newItems = state.items.filter((o) => o.priceId);
      }
      return {
        ...state,
        items: newItems,
      };
    default:
      return state;
  }
};
