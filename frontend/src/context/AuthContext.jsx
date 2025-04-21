import React, { createContext, useState, useEffect, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Provide the AuthContext to the entire app
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => localStorage.getItem("user") || null);
	const [token, setToken] = useState(() => localStorage.getItem("token") || null);
	const [role, setRole] = useState(() => localStorage.getItem("role") || null);

	// Save user, role, and token when changed
	useEffect(() => {
		if (user && token) {
			localStorage.setItem("user", user);
			localStorage.setItem("token", token);
			localStorage.setItem("role", role);
		} else {
			localStorage.clear();
			setUser(null); // Not sure how necessary, but just in case
			setToken(null);
			setRole(null);
		}
	}, [user, token, role]);

	const login = (username, accessToken, role) => {
		setUser(username);
		setToken(accessToken);
		setRole(role);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		setRole(null);
		localStorage.clear();
	};

	return (
		<AuthContext.Provider value={{ user, token, role, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
