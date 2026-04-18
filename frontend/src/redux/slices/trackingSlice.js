import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  livreurPosition: null,
  commandeId: null,
  isConnected: false,
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setLivreurPosition(state, action) {
      state.livreurPosition = action.payload;
    },
    setTrackingCommande(state, action) {
      state.commandeId = action.payload;
    },
    setTrackingConnected(state, action) {
      state.isConnected = action.payload;
    },
    resetTracking(state) {
      state.livreurPosition = null;
      state.commandeId = null;
      state.isConnected = false;
    },
  },
});

export const {
  setLivreurPosition,
  setTrackingCommande,
  setTrackingConnected,
  resetTracking,
} = trackingSlice.actions;

export default trackingSlice.reducer;
