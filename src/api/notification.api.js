import apiClient from './axios.config';

export const notificationApi = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/notifications');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement des notifications' };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du marquage de la notification' };
    }
  },
};
