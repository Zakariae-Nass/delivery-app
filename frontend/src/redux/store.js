/**
 * store.js
 *
 * Le store Redux central de l'application.
 *
 * configureStore (de @reduxjs/toolkit) fait 3 choses en une :
 *   1. Combine les reducers (remplace combineReducers manuel)
 *   2. Active Redux DevTools automatiquement en développement
 *   3. Ajoute le middleware redux-thunk par défaut (pour les actions async)
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    // La clé "auth" détermine le chemin dans le state global :
    // useSelector(state => state.auth.isLoggedIn)
    auth: authReducer,
  },
});

export default store;
