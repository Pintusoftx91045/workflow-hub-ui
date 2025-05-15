
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'client' | 'draft' | 'qc' | 'qa';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    // For demo purposes
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
      } else {
        state.user = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          role: action.payload,
        };
        state.isAuthenticated = true;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUserRole } = authSlice.actions;

export default authSlice.reducer;
