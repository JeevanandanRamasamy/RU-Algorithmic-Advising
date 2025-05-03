import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/minilogo.png";
import {
	showErrorToast,
	showInfoToast,
	showSuccessToast,
	showWarningToast
} from "../components/toast/Toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Login component - Handles the user login functionality.
 */
function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const { login, user, role } = useAuth();
	const navigate = useNavigate();

	/**
	 * Effect to redirect user based on their authentication state.
	 */
	useEffect(() => {
		if (user) {
			if (role === "admin") {
				navigate("/admin/home");
			} else {
				navigate("/student/home");
			}
		}
	}, [user, role, navigate]);

	/**
	 * Handles the login form submission.
	 * Sends login request to the backend and processes the response.
	 */
	const handleLogin = async e => {
		e.preventDefault();
		const response = await fetch(`${backendUrl}/api/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok) {
			login(username, data.access_token, data.role); // Store username, token, and role in AuthContext
			// localStorage.setItem("token", data.access_token); // Persist it
			navigate("/home");

			if (data.role === "admin") {
				navigate("/admin/home");
			} else {
				navigate("/student/home");
			}
		} else {
			setMessage(data.message || "Something went wrong, please try again");
		}
	};

	return (
		<div className="h-screen flex items-center justify-center overflow-hidden">
			<></>
			<div className="w-2/3 h-screen flex items-center mb-0 justify-center">
				<div className="w-full max-w-lg p-8 flex flex-col items-center">
					{/* Logo Section */}
					<div className="mb-4">
						<img
							src={logo}
							alt="Logo"
							className="w-32 h-32"
						/>
					</div>
					<header className="mb-0">
						<h1>Welcome!</h1>
					</header>
					<p>
						Need an account? <Link to="/register">Create an Account</Link>
					</p>
					<form
						onSubmit={handleLogin}
						className="flex flex-col items-center">
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={e => setUsername(e.target.value)}
							className="border rounded-md p-2 mb-4 block"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							className="border rounded-md p-2 mb-0 block"
						/>
						<br />
						<button
							onClick={handleLogin}
							className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 ">
							Login
						</button>
					</form>
					<p>
						<Link to="/reset-password">Forgot password?</Link>
					</p>
					<p>{message}</p>
				</div>
			</div>

			<div className="w-1/3 h-screen bg-red-500 flex items-center justify-center">
				{/* Replace with an image if needed */}
				{/* <img src="your-image-url.jpg" alt="Description" className="w-full h-full object-cover" /> */}
			</div>
		</div>
	);
}

export default Login;
