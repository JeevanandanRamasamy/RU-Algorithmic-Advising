import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const AuthWatcher = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    let timeoutId;

    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      if (timeUntilExpiry <= 0) {
        logout();
        navigate("/");
      } else {
        timeoutId = setTimeout(() => {
          logout();
          navigate("/");
        }, timeUntilExpiry);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
      navigate("/");
    }

    return () => clearTimeout(timeoutId);
  }, [token, logout, navigate]);

  return null;
};

export default AuthWatcher;
