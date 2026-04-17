import { useState } from 'react';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      // Le service gère le stockage du token (SecureStore) en interne.
      const { user } = await authService.login(data);
      onSuccess(user.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      await authService.register(data);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
