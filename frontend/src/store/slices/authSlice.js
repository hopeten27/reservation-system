import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          if (payload.success && payload.data.user) {
            state.user = payload.data.user;
            state.isAuthenticated = true;
          }
        }
      )
      // Handle register
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          if (payload.success && payload.data.user) {
            state.user = payload.data.user;
            state.isAuthenticated = true;
          }
        }
      )
      // Handle getMe
      .addMatcher(
        authApi.endpoints.getMe.matchPending,
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getMe.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          if (payload.success && payload.data.user) {
            state.user = payload.data.user;
            state.isAuthenticated = true;
          }
        }
      )
      .addMatcher(
        authApi.endpoints.getMe.matchRejected,
        (state) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }
      )
      // Handle logout
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
        }
      );
  },
});

export const { logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;