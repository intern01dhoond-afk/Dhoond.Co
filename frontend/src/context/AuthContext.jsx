import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dhoond_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  // Call after OTP verify — pass full user object from backend
  const login = (name, mobileNumber, extras = {}) => {
    const newUser = { name, mobile: mobileNumber, ...extras };
    setUser(newUser);
    localStorage.setItem('dhoond_user', JSON.stringify(newUser));
  };

  // Update user profile fields without full re-login
  const updateUser = (fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('dhoond_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dhoond_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
