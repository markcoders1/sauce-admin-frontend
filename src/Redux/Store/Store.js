// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import SnackAlertReducer from "../Slice/SnackAlertSlice/SnackAlertSlice.js";
import UserReducer from "../Slice/UserSlice/UserSlice.js";
import brandReducer from '../Slice/brandSlice/brandSlice.js';
// import sidebarReducer from '../Slice/sidebarSlice/sidebarSlice.jsx' 
import sidebarReducer from '../Slice/sidebarSlice/sidebarSlice.js'

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  auth: UserReducer,
  snackAlert: SnackAlertReducer,
  brand: brandReducer,
  sidebar: sidebarReducer, // Include sidebar slice here
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
