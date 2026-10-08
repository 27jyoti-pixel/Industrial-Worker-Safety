import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('industrial_user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('industrial_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('industrial_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user session
  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      if (!token) {
        localStorage.removeItem('industrial_user');
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await authService.getProfile();
        const userData = data?.user || data?.data?.user || data?.data || data;
        if (!userData?._id) throw new Error('Authenticated profile could not be loaded.');
        if (active) {
          setUser(userData);
          localStorage.setItem('industrial_user', JSON.stringify(userData));
        }
      } catch (err) {
        if (active) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('industrial_token');
          localStorage.removeItem('industrial_user');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    initAuth();
    return () => { active = false; };
  }, [token]);

  const login = async (email, password, expectedRole) => {
    const response = await authService.login({ email: email.trim(), password, expectedRole });
    const payload = response?.data || response;
    const authToken = payload.token || payload.data?.token;
    const userData = payload.user || payload.data?.user;

    if (!authToken || !userData?._id) {
      throw new Error('Authentication response was incomplete. Please try again.');
    }
    if (userData.role !== expectedRole) {
      throw new Error('The account role does not match the selected workspace.');
    }

    localStorage.setItem('industrial_token', authToken);
    localStorage.setItem('industrial_user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    return userData;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const payload = data?.data || data;
    const authToken = payload.token || payload.data?.token;
    const userResult = payload.user || payload.data?.user;

    if (!authToken || !userResult?._id || userResult.role !== userData.role) {
      throw new Error('Registration response did not contain the created account session.');
    }

    localStorage.setItem('industrial_token', authToken);
    localStorage.setItem('industrial_user', JSON.stringify(userResult));
    setToken(authToken);
    setUser(userResult);
    return data;
  };

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    const payload = response?.data || response;
    const updatedUser = payload.user || payload.data?.user || payload.data || payload;

    if (updatedUser && updatedUser._id) {
      localStorage.setItem('industrial_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    return updatedUser;
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
        updateProfile,
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
