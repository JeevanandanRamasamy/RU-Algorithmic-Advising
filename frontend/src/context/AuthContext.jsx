import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Provide the AuthContext to the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check if there is a stored user and token on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  // Login function
  const login = (username, authToken) => {
    setUser(username);
    setToken(authToken);
    localStorage.setItem("username", username);
    localStorage.setItem("token", authToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
