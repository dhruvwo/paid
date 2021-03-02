import {CartState} from '../../constants/GlobalState';

const addItem = (data) => ({
  type: CartState.ADD_ITEM,
  data,
});

const updateItem = (data) => ({
  type: CartState.UPDATE_ITEM,
  data,
});

const removeItem = (data) => ({
  type: CartState.REMOVE_ITEM,
  data,
});

const clearItems = (data) => ({
  type: CartState.CLEAR_ITEMS,
  data,
});

export const cartAction = {
  addItem,
  updateItem,
  removeItem,
  clearItems,
};
