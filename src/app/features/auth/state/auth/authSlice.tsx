import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  loginEmployee,
  registerEmployee,
  currentLoggedEmployee,
  logoutEmployee,
  type AuthUser,
} from './authAction';

interface AuthState {
  employee: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  employee: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateEmployee: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.employee) {
        Object.assign(state.employee, action.payload);
      }
    },
    removeEmployee: (state) => {
      state.employee = null;
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employee = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Login failed';
        state.isAuthenticated = false;
      })

      // Register
      .addCase(registerEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employee = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Registration failed';
        state.isAuthenticated = false;
      })

      // Session check (auth/me) - does NOT populate form error on rejection
      .addCase(currentLoggedEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentLoggedEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.employee = action.payload;
          state.isAuthenticated = true;
        } else {
          state.employee = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(currentLoggedEmployee.rejected, (state) => {
        state.isLoading = false;
        state.employee = null;
        state.isAuthenticated = false;
        // Note: deliberately NOT setting state.error here to prevent false error banners on login page
      })

      // Logout
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.employee = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutEmployee.rejected, (state) => {
        state.employee = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { updateEmployee, removeEmployee, clearError } = authSlice.actions;
export default authSlice.reducer;