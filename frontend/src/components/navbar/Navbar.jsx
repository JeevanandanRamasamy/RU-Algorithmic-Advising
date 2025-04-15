import React, { useState, useEffect, useRef } from "react";
import "./style.css"; // Ensure styles are imported
import logo from "../../assets/minilogo.png";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import { useAuth } from "../../context/AuthContext"; // Import authentication context
import { showSuccessToast } from "../toast/Toast"; // Import toast function

const Navbar = () => {
	const [isCollapsed, setIsCollapsed] = useState(() => {
		// Read from localStorage on first render
		const stored = localStorage.getItem("navbar-collapsed");
		return stored === null ? true : stored === "true"; // default: collapsed
	});
	const [isColorFlipped, setIsColorFlipped] = useState(false);

	const { user, role, logout } = useAuth(); // Get auth state and logout function
	const navigate = useNavigate();
	const toastCooldownRef = useRef(false);

	const toggleColors = () => {
		setIsColorFlipped((prev) => !prev);
		const root = document.documentElement;

		const currentPrimary = getComputedStyle(root).getPropertyValue('--primary-color').trim();
		const currentSidebar = getComputedStyle(root).getPropertyValue('--sidebar-color').trim();

		// Swap the primary and sidebar colors
		root.style.setProperty('--primary-color', currentSidebar);
		root.style.setProperty('--sidebar-color', currentPrimary);

		if (!isColorFlipped) {
			root.style.setProperty('--title-color', '#fcf8d7');
			root.style.setProperty('--hover-text-color', '#000');
		} else {
			root.style.setProperty('--title-color', '#000');
			root.style.setProperty('--hover-text-color', '#fff');
		}

		// Show toast with throttle
		if (!toastCooldownRef.current) {
			showSuccessToast("Theme colors flipped!");
			toastCooldownRef.current = true;
			setTimeout(() => {
				toastCooldownRef.current = false;
			}, 5000);
		}
	};

	const toggleNavbar = () => {
		setIsCollapsed(prev => {
			const newState = !prev;
			localStorage.setItem("navbar-collapsed", newState); // Save on toggle
			return newState;
		});
	};

	// Redirect to login page if not authenticated
	useEffect(() => {
		if (!user) {
			navigate("/"); // Redirect to login if user is not found
		}
	}, [user, navigate]);

	return (
		<nav className={`sidebar ${isCollapsed ? "close" : ""} z-100`}>
			<div className="nav-top">
				<div className="header">
					<span className="image">
						<img
							src={logo}
							alt="Logo"
							className="w-16 h-16 cursor-pointer transition-transform duration-300 hover:rotate-12"
							onClick={toggleColors}
						/>
					</span>
					<div className="header-text text">
						<span className="name">
							RU Super
							<br />
							Scheduler
						</span>
					</div>
					<i
						className={`bx ${isCollapsed ? "bx-chevron-right" : "bx-chevron-left"} toggle`}
						onClick={toggleNavbar}
						role="button"
						tabIndex="0"
					></i>
				</div>
			</div>

			<div className="menu-bar">
				{role === "student" && (
					<div className="nav-middle">
						<li className="nav-link">
							<Link to="/student/home">
								<i className="bx bx-grid-alt icon"></i>
								<span className="text nav-text">Dashboard</span>
							</Link>
						</li>
						<li className="nav-link">
							<Link to="/degree-planner">
								<i className="bx bx-spreadsheet icon"></i>
								<span className="text nav-text">Degree Planner</span>
							</Link>
						</li>
						<li className="nav-link">
							<Link to="/course-planner">
								<i className="bx bx-calendar icon"></i>
								<span className="text nav-text">Course Planner</span>
							</Link>
						</li>
						<li className="nav-link">
							<Link to="/request-spn">
								<i className="bx bx-envelope icon"></i>
								<span className="text nav-text">Request SPN</span>
							</Link>
						</li>
						<li className="nav-link">
							<Link to="/questionnaire">
								<i className="bx bx-edit-alt icon"></i>
								<span className="text nav-text">Questionnaire</span>
							</Link>
						</li>
					</div>
				)}

				{role === "admin" && (
					<div className="nav-middle">
						<li className="nav-link">
							<Link to="/admin/home">
								<i className="bx bx-grid-alt icon"></i>
								<span className="text nav-text">Admin Dashboard</span>
							</Link>
						</li>
					</div>
				)}
				<div className="nav-bottom">
					<li className="nav-link">
						<a href="/account-settings">
							<i className="bx bx-user-circle icon"></i>
							<span className="text nav-text">Account Settings</span>
						</a>
					</li>
					<li className="nav-link">
						<a
							href=""
							onClick={(e) => {
								e.preventDefault(); // prevent default anchor behavior
								logout(); // your logout function
								showSuccessToast("You have been logged out successfully!");
							}}
						>
							<i className="bx bx-log-out icon"></i>
							<span className="text nav-text">Logout</span>
						</a>
					</li>
				</div>
			</div>
		</nav >
	);
};

export default Navbar;
