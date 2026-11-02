import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser as apiRegister, loginUser as apiLogin, getUserProfile } from '../services/authService';
import { currentUser as fallbackUser } from '../utils/constants';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'kanbanboard_token';
const USER_KEY = 'kanbanboard_user';

function formatUserData(user, course = '') {
  if (!user) return null;
  const name = user.name || 'Crew Member';
  const initials = name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return {
    _id: user._id || user.id,
    id: user._id || user.id,
    name: name,
    email: user.email || '',
    role: user.role || 'user',
    course: course || user.course || 'MERN Stack Lab',
    initials: initials,
    color: '#2D5A45',
    textColor: '#FFFFFF',
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync / verify token with backend on mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        const result = await getUserProfile(storedToken);
        if (result.success && result.data) {
          const formatted = formatUserData(result.data);
          setUser(formatted);
          localStorage.setItem(USER_KEY, JSON.stringify(formatted));
        } else if (result.status === 401) {
          // Token is expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken('');
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    verifySession();
  }, []);

  // Register function
  const register = useCallback(async ({ name, email, password, course }) => {
    const result = await apiRegister({ name, email, password });
    if (result.success && result.data) {
      const receivedToken = result.data.token;
      const formattedUser = formatUserData(result.data.user, course);

      if (receivedToken) {
        localStorage.setItem(TOKEN_KEY, receivedToken);
        setToken(receivedToken);
      }
      if (formattedUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(formattedUser));
        setUser(formattedUser);
      }

      return { success: true, data: result.data };
    }
    return result;
  }, []);

  // Login function
  const login = useCallback(async ({ email, password }) => {
    const result = await apiLogin({ email, password });
    if (result.success && result.data) {
      const receivedToken = result.data.token;
      const formattedUser = formatUserData(result.data.user);

      if (receivedToken) {
        localStorage.setItem(TOKEN_KEY, receivedToken);
        setToken(receivedToken);
      }
      if (formattedUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(formattedUser));
        setUser(formattedUser);
      }

      return { success: true, data: result.data };
    }
    return result;
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  }, []);

  // Active user (defaults to fallbackUser if unauthenticated)
  const activeUser = user || fallbackUser;

  const value = {
    user: activeUser,
    authenticatedUser: user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
