import {auth} from '../../services/api';

const login = (email) => {
  return () => {
    return auth
      .login(email)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error('error in login action!!', err);
        return err.response;
      });
  };
};

export const authAction = {
  login,
};
