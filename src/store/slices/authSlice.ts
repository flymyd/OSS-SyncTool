import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  userId: number | null;
  currentUser: {
    username: string;
    userId: number;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  userId: Number(localStorage.getItem('userId')) || null,
  currentUser: localStorage.getItem('username') && localStorage.getItem('userId') 
    ? {
        username: localStorage.getItem('username')!,
        userId: Number(localStorage.getItem('userId'))!,
      }
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ username: string; userId: number }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.currentUser = {
        username: action.payload.username,
        userId: action.payload.userId,
      };
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.userId = null;
      state.currentUser = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
