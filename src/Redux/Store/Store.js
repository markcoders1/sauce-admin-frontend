// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import SnackAlertReducer from "../Slice/SnackAlertSlice/SnackAlertSlice.js";
import UserReducer from "../Slice/UserSlice/UserSlice.js";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import brandReducer from '../Slice/brandSlice/brandSlice.js';

const rootReducer = combineReducers({
  auth: UserReducer,
  snackAlert: SnackAlertReducer,
  brand: brandReducer, // Include it here
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
