import apiClient from './axios.config';

export const catalogApi = {
  getPackageTypes: async () => {
    try {
      const response = await apiClient.get('/package-types');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement des types de colis' };
    }
  },

  getVehicleTypes: async () => {
    try {
      const response = await apiClient.get('/vehicle-types');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement des vehicules' };
    }
  },

  getPackageSizes: async () => {
    try {
      const response = await apiClient.get('/package-sizes');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Erreur lors du chargement des tailles' };
    }
  },
};
