import React, { createContext, useContext, useState } from "react";

// Create Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
  // user will store: { name, role, token }
  const [user, setUser] = useState(null);

  // login function to set user
  const login = (userData) => {
    setUser(userData);
  };

  // logout function to clear user
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use context
export const useAuth = () => useContext(AuthContext);