import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  activeCommande: null,
  applications: {},
  selectionTimer: {},
  isLoading: false,
  error: null,
};

const commandesSlice = createSlice({
  name: 'commandes',
  initialState,
  reducers: {
    setCommandes(state, action) {
      state.list = action.payload;
      state.isLoading = false;
    },
    setActiveCommande(state, action) {
      state.activeCommande = action.payload;
    },
    updateCommandeStatus(state, action) {
      const { commandeId, status } = action.payload;
      const idx = state.list.findIndex((c) => c.id === commandeId);
      if (idx !== -1) state.list[idx].status = status;
      if (state.activeCommande?.id === commandeId) {
        state.activeCommande = { ...state.activeCommande, status };
      }
    },
    addApplication(state, action) {
      const { commandeId, livreur } = action.payload;
      if (!state.applications[commandeId]) {
        state.applications[commandeId] = [];
      }
      const exists = state.applications[commandeId].find(
        (a) => a.livreur.id === livreur.id,
      );
      if (!exists) {
        state.applications[commandeId].push({ livreur });
      }
    },
    setApplications(state, action) {
      const { commandeId, applications } = action.payload;
      state.applications[commandeId] = applications;
    },
    updateSelectionTimer(state, action) {
      const { commandeId, secondsLeft } = action.payload;
      state.selectionTimer[commandeId] = secondsLeft;
    },
    setAssignedCommande(state, action) {
      state.activeCommande = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    addCommande(state, action) {
      state.list.unshift(action.payload);
    },
    removeCommande(state, action) {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  setCommandes,
  setActiveCommande,
  updateCommandeStatus,
  addApplication,
  setApplications,
  updateSelectionTimer,
  setAssignedCommande,
  setLoading,
  setError,
  addCommande,
  removeCommande,
} = commandesSlice.actions;

export default commandesSlice.reducer;
