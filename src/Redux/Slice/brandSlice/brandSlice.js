import { createSlice } from '@reduxjs/toolkit';

export const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    email: '',
    name: ''
  },
  reducers: {
    setBrandInfo: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearBrandInfo: (state) => {
      state.email = '';
      state.name = '';
    }
  }
});

export const { setBrandInfo, clearBrandInfo } = brandSlice.actions;

export default brandSlice.reducer;
