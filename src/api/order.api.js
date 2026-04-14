import apiClient from './axios.config';

export const orderApi = {
  getOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement des commandes' };
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement de la commande' };
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors de la creation de la commande' };
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { statut: status });
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors de la mise a jour du statut' };
    }
  },
};
