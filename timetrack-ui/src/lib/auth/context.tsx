'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from './types';
import axios from 'axios';
import { App } from 'antd';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set auth cookies
const setAuthCookies = (access: string, refresh: string) => {
  // Set secure, httpOnly cookies with appropriate expiration
  Cookies.set('access_token', access, { 
    expires: 1/24, // 1 hour 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  Cookies.set('refresh_token', refresh, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Helper function to remove auth cookies
const removeAuthCookies = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const { message } = App.useApp();

  // Configure axios defaults
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post('/auth/login/', credentials);
      
      // Destructure tokens from response
      const { access, refresh } = response.data;
      
      // Set auth cookies
      setAuthCookies(access, refresh);

      // Get user profile 
      const userResponse = await axios.get('/auth/me/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      const user = userResponse.data;
      setState({ user, isAuthenticated: true, isLoading: false });
      message.success('Successfully logged in!');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Failed to login. Please check your credentials.');
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await axios.post('/auth/register/', credentials);
      
      // Automatically log in after registration
      await login({
        email: credentials.email,
        password: credentials.password
      });

      message.success('Successfully registered!');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Failed to register. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove tokens from cookies
      removeAuthCookies();

      setState({ user: null, isAuthenticated: false, isLoading: false });
      message.success('Successfully logged out!');
    } catch (error) {
      message.error('Failed to logout.');
      throw error;
    }
  };

  const checkAuth = async () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    if (!accessToken || !refreshToken) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await axios.get('/auth/me/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const user = response.data;
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If access token is invalid, try to refresh
      try {
        const refreshResponse = await axios.post('/auth/refresh/', { 
          refresh: refreshToken 
        });
        
        const { access: newAccessToken } = refreshResponse.data;
        
        // Update access token cookie
        setAuthCookies(newAccessToken, refreshToken);

        // Retry getting user profile
        const userResponse = await axios.get('/auth/me/', {
          headers: { Authorization: `Bearer ${newAccessToken}` }
        });
        
        const user = userResponse.data;
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch (refreshError) {
        // Refresh failed, clear authentication
        removeAuthCookies();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
