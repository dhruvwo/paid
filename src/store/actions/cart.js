import {CartState} from '../../constants/GlobalState';

const addProduct = (data) => ({
  type: CartState.ADD_PRODUCT,
  data,
});

const updateCart = (data) => ({
  type: CartState.UPDATE_CART,
  data,
});

const removeProduct = (data) => ({
  type: CartState.REMOVE_PRODUCT,
  data,
});

const clearCart = (data) => ({
  type: CartState.CLEAR_CART,
  data,
});

export const cartAction = {
  addProduct,
  updateCart,
  removeProduct,
  clearCart,
};
