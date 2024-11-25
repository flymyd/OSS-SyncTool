import {configureStore} from '@reduxjs/toolkit';
import workspaceReducer from './slices/workspaceSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
