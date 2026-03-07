import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(data);

      // Sauvegarde token et user en local
      await AsyncStorage.setItem('token', response.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));

      onSuccess(response.user.role);
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur de connexion';
      setError(message);
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
      const message = err.response?.data?.message || 'Erreur inscription';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
