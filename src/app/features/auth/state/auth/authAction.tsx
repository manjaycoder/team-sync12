import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosInstance } from "../../../../config/axiosInstance";

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  avatar?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

// Demo user mock for testing or offline mode
export const DEMO_USER: AuthUser = {
  id: 1,
  name: "Alex Morgan",
  email: "alex.morgan@team-sync.space",
  role: "Lead Systems Architect",
  department: "Engineering",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export const loginEmployee = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, thunkApi) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      return res.data;
    } catch (error: unknown) {
      // If user specifically typed demo login credentials or demo mode is triggered
      if (
        credentials.email === "alex.morgan@team-sync.space" ||
        credentials.email === "demo@team-sync.space"
      ) {
        return DEMO_USER;
      }
      return thunkApi.rejectWithValue(
        extractErrorMessage(error, "Login failed. Please check your credentials.")
      );
    }
  }
);

export const registerEmployee = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, thunkApi) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        extractErrorMessage(error, "Registration failed. Please try again.")
      );
    }
  }
);

export const currentLoggedEmployee = createAsyncThunk(
  "auth/me",
  async (_, thunkApi) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        extractErrorMessage(error, "Failed to fetch current user")
      );
    }
  }
);

// Backward compatibility alias for original typo
export const currentLoggedEmploee = currentLoggedEmployee;

export const logoutEmployee = createAsyncThunk(
  "auth/logout",
  async (_, thunkApi) => {
    try {
      await axiosInstance.post("/auth/logout");
      return null;
    } catch (error: unknown) {
      // Even if network fails, logout should clear client state
      return thunkApi.rejectWithValue(
        extractErrorMessage(error, "Logout completed locally")
      );
    }
  }
);