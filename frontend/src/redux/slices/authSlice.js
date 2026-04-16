/**
 * authSlice.js
 *
 * Gère TOUT l'état d'authentification de l'application dans Redux.
 *
 * Pourquoi Redux pour l'auth ?
 * → L'état auth est lu par plusieurs composants qui ne se connaissent pas :
 *   StackNavigator (pour router), LoginScreen (pour loading/error),
 *   DashboardScreen (pour afficher le nom de l'agence), etc.
 *   Redux évite de faire passer des props sur 3 niveaux (prop drilling).
 *
 * Ce que ce slice stocke :
 * → isLoggedIn : booléen qui pilote toute la navigation
 * → user       : objet retourné par GET /auth/me (id, email, username, role, phone…)
 * → token      : le JWT brut — utile si on veut le rafraîchir plus tard
 * → loading    : true pendant l'appel API, pour afficher le spinner
 * → error      : message d'erreur à afficher sous le formulaire
 */

import { createSlice } from '@reduxjs/toolkit';

// ─── State initial ────────────────────────────────────────────────────────────
// C'est l'état de départ AU LANCEMENT de l'app (avant hydratation depuis SecureStore).
const initialState = {
  isLoggedIn: false,

  // Objet user complet tel que retourné par GET /auth/me :
  // { id, username, email, phone, role, location, createdAt, ... }
  // + pour les livreurs : rate, vehicleType, docVerification
  user: null,

  // Le JWT brut (string "eyJ...") retourné par POST /auth/login
  token: null,

  // true pendant les appels réseau — contrôle le spinner dans LoginScreen
  loading: false,

  // null par défaut, string d'erreur si le login échoue
  // ex: "Email ou mot de passe incorrect"
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    /**
     * loginStart
     * Appelé AU DÉBUT de l'appel API (avant la réponse).
     * → Active le spinner, efface l'éventuelle erreur précédente.
     */
    loginStart(state) {
      state.loading = true;
      state.error   = null;
    },

    /**
     * loginSuccess
     * Appelé quand POST /auth/login + GET /auth/me ont réussi.
     *
     * action.payload = { user, token }
     *   user  : objet complet de GET /auth/me (sans le password)
     *   token : string JWT de POST /auth/login
     *
     * C'est ce reducer qui déverrouille la navigation vers les écrans protégés.
     */
    loginSuccess(state, action) {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.user       = user;
      state.token      = token;
      state.loading    = false;
      state.error      = null;
    },

    /**
     * loginFailure
     * Appelé si l'API retourne une erreur (401, 409, réseau down, etc.)
     *
     * action.payload = string — le message à afficher à l'utilisateur
     */
    loginFailure(state, action) {
      state.loading = false;
      state.error   = action.payload;
    },

    /**
     * logout
     * Remet tout à zéro — renvoie l'utilisateur vers Login.
     * Le nettoyage de SecureStore est fait dans le thunk qui appelle ce reducer
     * (voir auth.service.js).
     */
    logout(state) {
      state.isLoggedIn = false;
      state.user       = null;
      state.token      = null;
      state.loading    = false;
      state.error      = null;
    },

    /**
     * clearError
     * Efface l'erreur quand l'utilisateur retape dans le champ email/password.
     * Évite de laisser affiché "Email incorrect" après correction.
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * restoreSession
     * Appelé au démarrage de l'app si un token valide existe dans SecureStore.
     * Permet de ne pas redemander le login à chaque ouverture.
     *
     * action.payload = { user, token }
     */
    restoreSession(state, action) {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.user       = user;
      state.token      = token;
    },
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

// Les actions — utilisées avec dispatch() dans les écrans et services
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  restoreSession,
} = authSlice.actions;

// Le reducer — enregistré dans store.js sous la clé "auth"
export default authSlice.reducer;
