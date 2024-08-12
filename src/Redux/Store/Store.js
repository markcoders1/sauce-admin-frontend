import { combineReducers, configureStore } from '@reduxjs/toolkit';
import SnackAlertReducer from "../Slice/SnackAlertSlice/SnackAlertSlice.js";
import UserReducer from "../Slice/UserSlice/UserSlice.js";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import brandReducer from '../Slice/brandSlice/brandSlice.js';

// Combine the reducers, excluding the brandReducer
const rootReducer = combineReducers({
  auth: UserReducer,
  snackAlert: SnackAlertReducer,
  brand: brandReducer, // Include it here but don't persist
  // sidebarToggle: SidebarToggleReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persisted: persistedReducer,
    brand: brandReducer, // Include brandReducer here to ensure it is in the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
