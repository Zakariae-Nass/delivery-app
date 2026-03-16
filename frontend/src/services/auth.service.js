import apiClient from '../api/axios.config';

export const authService = {

  login: async (data) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

};
