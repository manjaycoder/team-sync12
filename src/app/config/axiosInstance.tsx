import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful fallback logging for network or CORS failures
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('Network / Server connection issue:', error.message);
    }
    
    return Promise.reject(error);
  }
);
