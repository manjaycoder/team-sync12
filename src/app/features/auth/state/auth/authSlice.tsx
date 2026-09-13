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

const getStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('team_sync_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const savedUser = getStoredUser();

const initialState: AuthState = {
  employee: savedUser,
  isLoading: false,
  error: null,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<AuthUser>) => {
      state.employee = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = null;
      try {
        localStorage.setItem('team_sync_user', JSON.stringify(action.payload));
      } catch {
        // Ignore storage errors
      }
    },
    removeEmployee: (state) => {
      state.employee = null;
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem('team_sync_user');
      } catch {
        // Ignore storage errors
      }
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
        try {
          localStorage.setItem('team_sync_user', JSON.stringify(action.payload));
        } catch {
          // Ignore
        }
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
        try {
          localStorage.setItem('team_sync_user', JSON.stringify(action.payload));
        } catch {
          // Ignore
        }
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Registration failed';
        state.isAuthenticated = false;
      })

      // Session check (auth/me) - does NOT populate form error on rejection
      .addCase(currentLoggedEmployee.pending, (state) => {
        // Only show loading if we don't already have a persisted session
        if (!state.employee) {
          state.isLoading = true;
        }
      })
      .addCase(currentLoggedEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.employee = action.payload;
          state.isAuthenticated = true;
          try {
            localStorage.setItem('team_sync_user', JSON.stringify(action.payload));
          } catch {
            // Ignore
          }
        }
      })
      .addCase(currentLoggedEmployee.rejected, (state) => {
        state.isLoading = false;
        // Do not overwrite user session if offline and had local storage
        if (!savedUser) {
          state.employee = null;
          state.isAuthenticated = false;
        }
        // Note: deliberately NOT setting state.error here to prevent false error banners on login page
      })

      // Logout
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.employee = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        try {
          localStorage.removeItem('team_sync_user');
        } catch {
          // Ignore
        }
      })
      .addCase(logoutEmployee.rejected, (state) => {
        state.employee = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        try {
          localStorage.removeItem('team_sync_user');
        } catch {
          // Ignore
        }
      });
  },
});

export const { addEmployee, removeEmployee, clearError } = authSlice.actions;
export default authSlice.reducer;