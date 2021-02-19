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

const getCustomers = (accountId, filter_name, start) => {
  return (dispatch) => {
    return customer
      .customers(accountId, filter_name, start)
      .then((response) => {
        if (response.status === 'success') {
          if (start === 0) {
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
};
