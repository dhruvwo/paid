import {customer} from '../../services/api';
import {CustomerState} from '../../constants/GlobalState';

const setCustomer = (data) => ({
  type: CustomerState.SET_CUSTOMERS,
  data,
});

const appendCustomer = (data) => ({
  type: CustomerState.APPEND_CUSTOMERS,
  data,
});

const clearCustomers = (data) => ({
  type: CustomerState.CLEAR_CUSTOMERS,
});

const getCustomers = (filters) => {
  return (dispatch) => {
    return customer
      .customers(filters)
      .then((response) => {
        if (response.status === 'success') {
          if (filters.start === 0) {
            dispatch(setCustomer(response));
          } else {
            dispatch(appendCustomer(response));
          }
        }
        return response;
      })
      .catch((err) => {
        console.error('error in customer action', err);
        return err.response;
      });
  };
};

const addCustomer = (accountId, filter_name, start) => {
  return (dispatch) => {
    return customer
      .addCustomer(accountId, filter_name, start)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error('error in add customer action', err);
        return err.response;
      });
  };
};

export const customerAction = {
  getCustomers,
  addCustomer,
  clearCustomers,
};
