import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
		<div>
			<h2>Login</h2>
			<p>
				Need an account?
				<Link to="/register">Create an Account</Link>
			</p>

			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<br />
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<br />
			<button onClick={handleLogin}>Login</button>
			<p>{message}</p>
		</div>
	);
	return (
		<div>
			<h2>Login</h2>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<br />
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<br />
			<button onClick={handleLogin}>Login</button>
			<p>{message}</p>
			<Link to="/register">Register</Link>
		</div>
	);
}

export default Login;
