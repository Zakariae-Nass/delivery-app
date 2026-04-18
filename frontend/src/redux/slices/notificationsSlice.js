import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.list.unshift({ ...action.payload, read: false, id: Date.now() });
      state.unreadCount += 1;
    },
    markAllRead(state) {
      state.list.forEach((n) => { n.read = true; });
      state.unreadCount = 0;
    },
    setNotifications(state, action) {
      state.list = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
  },
});

export const { addNotification, markAllRead, setNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
