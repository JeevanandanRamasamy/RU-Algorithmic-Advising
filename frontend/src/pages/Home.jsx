import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
// import LogoutButton from "../components/navbuttons/LogoutButton"; // Import LogoutButton
import Navbar from "../components/navbar/Navbar";

function Home() {
	const { user } = useAuth(); // Get user
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/"); // Redirect to login if not authenticated
		}
	}, [user, navigate]); // Runs whenever user changes

	return (
		<div className="flex justify-end items-center h-screen pr-5">
			<h2>
				Welcome {user} to the home page. Unsure what to put on the home page that is not in
				the navbar already
			</h2>{" "}
			{/* Display username */}
			<Navbar />
		</div>
	);
}

export default Home;
