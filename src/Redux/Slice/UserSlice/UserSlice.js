import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    _id: null,
    username: null,
    email: null,
    createdAt: null,
    updatedAt: null,
    authenticated: false,
    type: null
  },
  reducers: {
    handleAuth: (state, action) => {
      return { ...state, ...action.payload };
    },
    logout:  (state, action) => {
      return { ...state, ...action.payload };
    
  },
}
});

export const { handleAuth, logout } = userSlice.actions;
export default userSlice.reducer;
