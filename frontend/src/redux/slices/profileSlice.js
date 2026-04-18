import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
      state.isLoading = false;
    },
    setProfileLoading(state, action) {
      state.isLoading = action.payload;
    },
    setProfileError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateProfileField(state, action) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { setProfile, setProfileLoading, setProfileError, updateProfileField } =
  profileSlice.actions;

export default profileSlice.reducer;
