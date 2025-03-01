import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]); // Runs only once when the component mounts

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Clear authentication
    navigate("/"); // Redirect back to login
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
