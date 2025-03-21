import React, { useState } from "react";
import "./style.css"; // Ensure styles are imported
import logo from "../../assets/minilogo.svg";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext to access logout
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Manages navbar state
  const { logout } = useAuth(); // Access logout function from context
  const navigate = useNavigate(); // Get navigate function from useNavigate

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate("/"); // Redirect to the login page
  };

  return (
    <nav className={`sidebar ${isCollapsed ? "close" : ""}`}>
      <div className="nav-top">
        <div className="header">
          <span className="image">
            <img src={logo} alt="Logo" />
          </span>
          <div className="header-text text">
            <span className="name">
              RuSuper
              <br />
              Scheduler
            </span>
          </div>
          <i className="bx bx-chevron-right toggle" onClick={toggleNavbar}></i>
        </div>
      </div>

      <div className="menu-bar">
        <div className="profile-pic text">
          <span className="image">
            <img src="#" alt="Profile" /> Picture
          </span>
        </div>
        <ul className="menu-links">
          <li className="nav-link">
            <Link to="/home">
              <i className="bx bx-home icon"></i>
              <span className="text nav-text">Dashboard</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/dragdrop">
              <i className="bx bx-bar-chart-alt-2 icon"></i>
              <span className="text nav-text">Degree Planner</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/course-planner">
              <i className="bx bxs-paper-plane icon"></i>
              <span className="text nav-text">Course Planner</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/request-spn">
              <i className="bx bx-bell icon"></i>
              <span className="text nav-text">Request SPN</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/questionnaire">
              <i className="bx bx-question-mark icon"></i>
              <span className="text nav-text">Questionnaire</span>
            </Link>
          </li>
        </ul>
        <div className="nav-bottom">
          <li className="nav-link">
            <a onClick={handleLogout}>
              <i className="bx bx-log-out icon"></i>
              <span className="text nav-text">Logout</span>
            </a>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
