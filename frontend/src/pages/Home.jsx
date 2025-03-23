import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import "../css/home.css";

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
			<Navbar />
			<h2 className="ml-[110px] pt-[5px]">
				Welcome {user} to the home page. Unsure what to put on the home page that is not in
				the navbar already
			</h2>
		</div>
	);
}

export default Home;
