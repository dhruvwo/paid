import {product} from '../../services/api';
import {ProductState} from '../../constants/GlobalState';

const setProduct = (data) => ({
  type: ProductState.SET_PRODUCTS,
  data,
});

const appendProduct = (data) => ({
  type: ProductState.APPEND_PRODUCTS,
  data,
});

const clearProducts = (data) => ({
  type: ProductState.CLEAR_PRODUCTS,
  data,
});

const getProducts = (filters) => {
  return (dispatch) => {
    return product
      .products(filters)
      .then((response) => {
        if (response.status === 'success') {
          if (filters.start === 0) {
            dispatch(setProduct(response));
          } else {
            dispatch(appendProduct(response));
          }
        }
        return response;
      })
      .catch((err) => {
        console.error('error in product action', err);
        return err.response;
      });
  };
};

export const productAction = {
  getProducts,
  clearProducts,
};
