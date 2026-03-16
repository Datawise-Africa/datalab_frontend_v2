import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from './storage';
import { useDispatch, useSelector } from 'react-redux';
import themeReducer from './slices/theme-slice';
import authReducer from './slices/auth-slice';
import filterReducer from './slices/filter-slice';
import modalReducer from './slices/modal-slice';
import datasetControlsReducer from './slices/dataset-controls-slice';

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  filters: filterReducer,
  modals: modalReducer,
  datasetControls: datasetControlsReducer,
});

const persistConfig = {
  key: 'datawise',
  version: 1,
  storage,
  whitelist: ['theme', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  preloadedState: undefined,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
