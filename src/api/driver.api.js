import apiClient from './axios.config';

export const driverApi = {
  getDrivers: async () => {
    try {
      const response = await apiClient.get('/drivers');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement des livreurs' };
    }
  },

  getDriverById: async (id) => {
    try {
      const response = await apiClient.get(`/drivers/${id}`);
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement du livreur' };
    }
  },

  assignDriver: async (orderId, driverId) => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/assign`, { driverId });
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors de l\'assignation du livreur' };
    }
  },
};
