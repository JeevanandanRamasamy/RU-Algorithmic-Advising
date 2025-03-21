import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import "../css/home.css";

function Home() {
  return (
    <div className="body-main">
      <Navbar /> {/* ✅ Navbar now checks authentication */}
      <div className="home-wrapper">
        <div className="home-content">
          <h2>Welcome to the home page</h2> {/* No need for loadedUser */}
          <Link to="/dragdrop">Planner</Link> {/* For testing */}
        </div>
      </div>
    </div>
  );
}

export default Home;
