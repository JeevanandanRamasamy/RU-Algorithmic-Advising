import React, { createContext, useState, useEffect, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Provide the AuthContext to the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  // Save user and token when changed
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", user);
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = (username, accessToken) => {
    setUser(username);
    setToken(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
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
