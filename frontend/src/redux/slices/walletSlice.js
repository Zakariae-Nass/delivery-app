import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  solde: 0,
  solde_bloque: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet(state, action) {
      const { solde, solde_bloque } = action.payload;
      state.solde = solde;
      state.solde_bloque = solde_bloque;
      state.isLoading = false;
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
    setWalletLoading(state, action) {
      state.isLoading = action.payload;
    },
    setWalletError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearWalletError(state) {
      state.error = null;
    },
  },
});

export const {
  setWallet,
  setTransactions,
  setWalletLoading,
  setWalletError,
  clearWalletError,
} = walletSlice.actions;

export default walletSlice.reducer;
