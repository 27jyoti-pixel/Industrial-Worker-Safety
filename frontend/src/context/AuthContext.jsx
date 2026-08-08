import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('industrial_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('industrial_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user session
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await authService.getProfile();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('industrial_user', JSON.stringify(data.user));
          } else if (data && data.data) {
            setUser(data.data);
            localStorage.setItem('industrial_user', JSON.stringify(data.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // const login = async (email, password) => {
  //   const data = await authService.login({ email, password });
  //   const authToken = data.token;
  //   const userData = data.user || data.data;

  //   localStorage.setItem('industrial_token', authToken);
  //   localStorage.setItem('industrial_user', JSON.stringify(userData));

  //   setToken(authToken);
  //   setUser(userData);
  //   return userData;
  // };

  const login = async (email, password) => {
  const response = await authService.login({ email, password });

  const authToken = response.data.token;
  const userData = response.data.user;

  localStorage.setItem('industrial_token', authToken);
  localStorage.setItem('industrial_user', JSON.stringify(userData));

  setToken(authToken);
  setUser(userData);

  return userData;
};

  const register = async (userData) => {
    const data = await authService.register(userData);
    const authToken = data.token;
    const userResult = data.user || data.data;

    if (authToken) {
      localStorage.setItem('industrial_token', authToken);
      localStorage.setItem('industrial_user', JSON.stringify(userResult));
      setToken(authToken);
      setUser(userResult);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('industrial_token');
    localStorage.removeItem('industrial_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (...allowedRoles) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  const isWorker = user?.role === 'Worker';
  const isFactoryAdmin = user?.role === 'Factory Admin';
  const isGovernmentOfficer = user?.role === 'Government Officer';
  const isSuperAdmin = user?.role === 'Super Admin';
  const isAdminOrOfficer = isFactoryAdmin || isGovernmentOfficer || isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        hasRole,
        isWorker,
        isFactoryAdmin,
        isGovernmentOfficer,
        isSuperAdmin,
        isAdminOrOfficer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
