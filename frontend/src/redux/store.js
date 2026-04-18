import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import commandesReducer from './slices/commandesSlice';
import notificationsReducer from './slices/notificationsSlice';
import profileReducer from './slices/profileSlice';
import trackingReducer from './slices/trackingSlice';
import walletReducer from './slices/walletSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    commandes: commandesReducer,
    tracking: trackingReducer,
    wallet: walletReducer,
    notifications: notificationsReducer,
    profile: profileReducer,
  },
});

export default store;
