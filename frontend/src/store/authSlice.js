// src/store/authSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser } from '../services/auth';

const initialState = {
  accessToken: localStorage.getItem('accessToken'),
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  error: null,
  loading: false
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginService(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      logoutService();
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch current user cases
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

// Base selectors
const selectAuth = state => state.auth;

// Memoized selectors
export const selectIsAuthenticated = createSelector(
  [selectAuth],
  auth => auth.isAuthenticated
);

export const selectCurrentUser = createSelector(
  [selectAuth],
  auth => auth.user
);

export const selectAuthError = createSelector(
  [selectAuth],
  auth => auth.error
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  auth => auth.loading
);

// Memoized role and permission selectors
export const selectUserRoles = createSelector(
  [selectCurrentUser],
  user => {
    if (!user?.roles) return [];
    return user.roles.map(role => typeof role === 'string' ? role : role.name);
  }
);

export const selectUserPermissions = createSelector(
  [selectCurrentUser],
  user => {
    if (!user?.roles) return [];
    const permissions = user.roles.flatMap(role => {
      if (typeof role === 'string') return [];
      return (role.permissions || []).map(permission => 
        typeof permission === 'string' ? permission : permission.name
      );
    });
    return [...new Set(permissions)]; // Remove duplicates
  }
);

// Helper selector creators (memoized)
export const createPermissionSelector = (permission) => 
  createSelector(
    [selectUserPermissions],
    permissions => permissions.includes(permission)
  );

export const createRoleSelector = (role) => 
  createSelector(
    [selectUserRoles],
    roles => roles.includes(role)
  );

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;