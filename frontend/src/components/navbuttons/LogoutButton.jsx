import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext to access logout

function LogoutButton() {
  const { logout } = useAuth(); // Access logout function from context
  const navigate = useNavigate(); // Get navigate function from useNavigate

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate("/"); // Redirect to the login page
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
