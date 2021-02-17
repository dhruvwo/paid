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

const getProducts = (accountId, filter_name, start) => {
  return (dispatch) => {
    return product
      .products(accountId, filter_name, start)
      .then((response) => {
        if (response.status === 'success') {
          dispatch(setProduct(response));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in product action', err);
        return err.response;
      });
  };
};

const getMoreProducts = (accountId, filter_name, start) => {
  return (dispatch) => {
    return product
      .products(accountId, filter_name, start)
      .then((response) => {
        if (response.status === 'success') {
          dispatch(appendProduct(response));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in append product action', err);
        return err.response;
      });
  };
};

export const productAction = {
  getProducts,
  getMoreProducts,
};
