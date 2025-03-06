import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import LogoutButton from "../components/navbuttons/LogoutButton"; // Import LogoutButton

function Home() {
  const { user } = useAuth(); // Get user
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [user, navigate]); // Runs whenever user changes

  return (
    <div>
      <h2>Welcome {user} to the home page</h2> {/* Display username */}
      <LogoutButton /> {/* Use the reusable LogoutButton */}
      <Link to="/dragdrop">Planner</Link> {/* For testing */}
      <p>
        <Link to="/questionnaire">QA</Link>
      </p>
    </div>
  );
}

export default Home;
