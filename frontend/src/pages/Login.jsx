import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleLogin = async () => {
		const response = await fetch("http://127.0.0.1:8080/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (data.status === "success") {
			localStorage.setItem("isAuthenticated", "true");
			navigate("/home");
		} else {
			setMessage("Invalid credentials");
		}
	};

	return (
		<>
			<div>
				<h2>Login</h2>
				<Link to="/register">Register</Link>
				<br />

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
		</>
	);
}

export default Login;
