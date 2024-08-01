

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const sidebarToggleSlice = createSlice({
  name: 'sidebarToggle',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleSidebar, openSidebar, closeSidebar } = sidebarToggleSlice.actions;

export default sidebarToggleSlice.reducer;
