import { combineReducers, configureStore } from '@reduxjs/toolkit';
import SnackAlertReducer from "./../Slice/SnackAlertSlice/SnackAlertSlice.js";
import UserReducer from "./../Slice/UserSlice/UserSlice.js";
import SidebarToggleReducer from './../Slice/ToggleSidebarSlice/ToggleSidearSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const rootReducer = combineReducers({
  auth: UserReducer,
  snackAlert: SnackAlertReducer,
  sidebarToggle: SidebarToggleReducer,
});

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
