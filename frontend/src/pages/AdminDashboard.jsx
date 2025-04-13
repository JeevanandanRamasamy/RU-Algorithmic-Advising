import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import useAccount from "../hooks/useAccount";
import "../css/home.css";

function AdminDashboard() {
  const { user, role } = useAuth(); // Get user
	const navigate = useNavigate();
	const { 
		firstName, 
		lastName 
	} = useAccount();

	useEffect(() => {
		if (!user) {
			navigate("/"); // Redirect to login if not authenticated
		}
		if (role === "student") {
			navigate("/student/home"); // Redirect to student home page if user is a student
	}, [user, navigate]); // Runs whenever user changes

  return (
    <div className="admin-dashboard">
      <Navbar />
      <h1>Welcome {firstName} {lastName} (Admin)!</h1>
      <p>This is the admin dashboard page. More functionality coming soon!</p>
    </div>
  );
}

export default AdminDashboard;
