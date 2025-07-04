import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import employeeReducer from '../features/employee/employeeSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';
import applicationsReducer from '../features/applications/applicationsSlice';
import purposeReducer from '../features/purpose/purposeSlice';
import statusReducer from '../features/status/statusSlice';
import masterDataReducer from '../features/masterData/masterSlice';

const sessionPersistConfig = {
  key: 'root',
  storage: sessionStorage, // Use session storage for most reducers
  whitelist: ['employee', 'user', 'units', 'auth', 'applications', 'pupose', 'allStatus', 'masterData'], // Persist these slices
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  user: userReducer,
  auth: authReducer,
  applications: applicationsReducer,
  pupose: purposeReducer,
  allStatus: statusReducer,
  masterData: masterDataReducer,
});

const persistedReducer = persistReducer(sessionPersistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    }),
});

// Export the store and persistor
export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
