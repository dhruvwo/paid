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

const clearCart = () => ({
  type: CartState.CLEAR_CART,
});

const addQuickPay = (data) => ({
  type: CartState.ADD_QUICKPAY,
  data,
});

const removeQuickPay = (data) => ({
  type: CartState.REMOVE_QUICKPAY,
  data,
});

const clearQuickPay = () => ({
  type: CartState.CLEAR_QUICKPAY,
});

export const cartAction = {
  addProduct,
  updateCart,
  removeProduct,
  clearCart,
  addQuickPay,
  removeQuickPay,
  clearQuickPay,
};
