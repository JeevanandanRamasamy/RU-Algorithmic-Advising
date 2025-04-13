import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import useAccount from "../hooks/useAccount";
import "../css/home.css";

function StudentDashboard() {
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
		if (role === "admin") {
			navigate("/admin/home"); // Redirect to admin dashboard if user is admin
		}
	}, [user, navigate]); // Runs whenever user changes

	return (
		<div className="flex justify-end items-center h-screen pr-5">
			<Navbar />
			<h2 className="ml-[110px] pt-[5px]">
				Welcome {firstName} {lastName}!
			</h2>
		</div>
	);
}

export default StudentDashboard;
