import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/minilogo.svg";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async () => {
		const response = await fetch(`${backendUrl}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok) {
			login(username, data.access_token); // Store username + token in AuthContext
			navigate("/home");
		} else {
			setMessage(data.message || "Something went wrong, please try again");
		}
	};

	return (
		<div className="h-screen flex items-center justify-center">
			<></>
			<div className="w-2/3 h-screen flex items-center mb-0 justify-center">
				<div className="w-full max-w-lg p-8 flex flex-col items-center">
					{/* Logo Section */}
					<div className="mb-4">
						<img
							src={logo}
							alt="Logo"
						/>
					</div>
					<header className="mb-0">
						<h1>Welcome!</h1>
					</header>
					<p>
						Need an account? <Link to="/register">Create an Account</Link>
					</p>

					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={e => setUsername(e.target.value)}
						className="border rounded-md p-2 mb-4"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="border rounded-md p-2 mb-0"
					/>
					<br />
					<p>
						{/* TODO: not sure how password change will work yet*/}
						<Link to="/register">Forgot password?</Link>
					</p>
					<button
						onClick={handleLogin}
						className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500">
						Login
					</button>
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
