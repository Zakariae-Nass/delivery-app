/**
 * useLogin.js
 *
 * Couche métier pour la connexion.
 * Orchestre : appel service → dispatch Redux.
 * Le screen ne fait qu'appeler handleLogin() et lire { loading, error }.
 */

import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../redux/slices/authSlice';
import { authService } from '../services/auth.service';

export default function useLogin() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async ({ email, password }) => {
    dispatch(loginStart());
    try {
      const { token, user } = await authService.login({ email, password });
      dispatch(loginSuccess({ token, user }));
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  const handleClearError = () => dispatch(clearError());

  return { handleLogin, loading, error, handleClearError };
}
