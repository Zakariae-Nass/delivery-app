import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth.api';

export const authService = {
  login: async (data) => {
    return authApi.login(data);
  },

  register: async (data) => {
    return authApi.register(data);
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};
