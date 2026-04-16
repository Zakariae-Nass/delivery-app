/**
 * axios.config.js
 *
 * Client HTTP central. Tous les appels API passent par ici.
 *
 * Changement par rapport à la version précédente :
 * → Remplacé AsyncStorage par expo-secure-store pour lire le token JWT.
 *   SecureStore chiffre les données sur le keychain iOS / Keystore Android.
 *   AsyncStorage est du texte brut non chiffré — inappropriate pour un JWT.
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/constants';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Intercepteur requête ────────────────────────────────────────────────────
// Avant CHAQUE appel HTTP, on lit le token depuis SecureStore.
// S'il existe, on l'injecte dans le header Authorization.
// Cela évite de passer le token manuellement dans chaque service.
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
