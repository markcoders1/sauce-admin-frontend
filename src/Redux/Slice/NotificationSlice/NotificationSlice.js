import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

const persistConfig = {
  key: 'notifications',
  storage,
};

export const { addNotification, deleteNotification, clearNotifications } = notificationSlice.actions;
export const notificationReducer = persistReducer(persistConfig, notificationSlice.reducer);
export default notificationReducer;
