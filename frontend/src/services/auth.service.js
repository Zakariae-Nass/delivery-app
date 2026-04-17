/**
 * auth.service.js
 *
 * Couche de communication avec le backend pour l'authentification.
 * Ce fichier ne touche PAS à Redux — il fait juste les appels réseau
 * et gère le stockage sécurisé du token.
 * C'est le composant/hook qui dispatch les actions Redux après l'appel.
 *
 * Corrections par rapport à la version précédente :
 * 1. login() : appelle maintenant GET /auth/me après POST /auth/login
 *    pour récupérer les infos user complètes (rôle, nom, etc.)
 * 2. register() : route correcte selon le rôle
 *    (/auth/register/agency ou /auth/register/delivery)
 * 3. Stockage : SecureStore au lieu d'AsyncStorage
 */

import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/axios.config';

// Clé de stockage du token dans SecureStore
const TOKEN_KEY = 'token';

export const authService = {

  /**
   * login
   *
   * Flux en 2 étapes :
   * 1. POST /auth/login → reçoit { access_token }
   * 2. Sauvegarde du token dans SecureStore (l'intercepteur axios l'utilisera)
   * 3. GET /auth/me → reçoit { user, profileCompleteness, ... }
   *
   * Retourne { token, user } pour que le appelant puisse dispatch(loginSuccess)
   */
  login: async ({ email, password }) => {
    try {
      // Étape 1 — Authentification : récupère le JWT
      const { data: loginData } = await apiClient.post('/auth/login', { email, password });
      const token = loginData.access_token;

      // Étape 2 — Stockage sécurisé AVANT l'appel /auth/me
      // L'intercepteur axios lit ce token pour Authorization: Bearer ...
      await SecureStore.setItemAsync(TOKEN_KEY, token);

      // Étape 3 — Récupération du profil complet (rôle, username, phone, etc.)
      // L'intercepteur ajoute automatiquement le token stocké à l'étape 2
      const { data: meData } = await apiClient.get('/auth/me');
      // meData = { user: { id, username, email, role, phone, ... }, profileCompleteness, ... }

      return { token, user: meData.user };
    } catch (err) {
      const message = err?.response?.data?.message || 'Erreur de connexion';
      throw new Error(Array.isArray(message) ? message.join(' ') : message);
    }
  },

  /**
   * register
   *
   * Route dynamique selon le rôle sélectionné dans le formulaire :
   * - 'livreur' → POST /auth/register/delivery
   * - 'agence'  → POST /auth/register/agency
   *
   * Mapping des champs frontend → backend :
   * - username (affiché "Nom" dans le formulaire) → username
   * - phone    (affiché "Téléphone" dans le formulaire) → phone
   *
   * Retourne { message, userId }
   */
  register: async ({ username, email, password, phone, role }) => {
    try {
      const route = role === 'livreur'
        ? '/auth/register/delivery'
        : '/auth/register/agency';

      const { data } = await apiClient.post(route, { username, email, password, phone });
      return data;
    } catch (err) {
      const message = err?.response?.data?.message || 'Erreur inscription';
      throw new Error(Array.isArray(message) ? message.join(' ') : message);
    }
  },

  /**
   * logout
   *
   * Supprime le token de SecureStore.
   * La remise à zéro du store Redux (isLoggedIn, user, token) est faite
   * par dispatch(logout()) dans le composant qui appelle cette fonction.
   */
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  /**
   * getStoredToken
   *
   * Utilisé au démarrage de l'app (dans StackNavigator) pour vérifier
   * si une session existe déjà sans demander à l'utilisateur de se reconnecter.
   */
  getStoredToken: () => SecureStore.getItemAsync(TOKEN_KEY),

};
