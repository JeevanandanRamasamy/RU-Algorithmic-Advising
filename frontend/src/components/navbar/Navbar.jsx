import React, { useState } from "react";
import "./style.css"; // Ensure styles are imported
import logo from "./images/minilogo.png";
import { Link } from "react-router-dom"; // Import Link for navigation

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Manages navbar state

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <nav className={`sidebar ${isCollapsed ? "close" : ""}`}>
      <div className="nav-top">
        <div className="header">
          <span className="image">
            <img src={logo} alt="Logo" style={{ width: "65px", height: "65px" }} />
          </span>
          <div className="header-text text">
            <span className="name">
              RU Super
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
            <Link to="/">
              <i className="bx bx-home icon"></i>
              <span className="text nav-text">Dashboard</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/degree-planner">
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
            <Link to="/logout">
              <i className="bx bx-log-out icon"></i>
              <span className="text nav-text">Logout</span>
            </Link>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
