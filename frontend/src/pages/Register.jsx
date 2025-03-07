import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // Load backend URL from env file

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); // Redirect after successful registration

	const handleRegister = async () => {
		// Basic validation
		if (!username || !password || !confirmPassword || !firstName || !lastName) {
			setMessage("All fields are required.");
			return;
		}
		if (password !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}
		if (password.length < 6) {
			setMessage("Password must be at least 6 characters.");
			return;
		}
		if (username.length > 6) {
			setMessage("Username must be 6 characters or less.");
			return;
		}

		setLoading(true); // Disable button while submitting

		try {
			const response = await fetch(`${backendUrl}/api/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					password,
					first_name: firstName,
					last_name: lastName
				})
			});

			const data = await response.json();

			if (data.status === "success") {
				setMessage("Registration successful! Redirecting to login...");
				setTimeout(() => navigate("/questionnaire"), 1500); // Redirect after success
			} else {
				setMessage(data.message || "Registration failed.");
			}
		} catch (error) {
			console.error("Error:", error);
			setMessage("Network error. Please try again later.");
		} finally {
			setLoading(false); // Re-enable button
		}
	};

	return (
		<div className="flex flex-col items-center">
			<Link to="/">LOGIN</Link>
			<h1>Register</h1>

			<input
				type="text"
				placeholder="Username (max 6 chars)"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				type="text"
				placeholder="First Name"
				value={firstName}
				onChange={e => setFirstName(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Last Name"
				value={lastName}
				onChange={e => setLastName(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password (min 6 chars)"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Confirm Password"
				value={confirmPassword}
				onChange={e => setConfirmPassword(e.target.value)}
			/>

			<button
				onClick={handleRegister}
				disabled={loading}>
				{loading ? "Registering..." : "Register"}
			</button>

			<p>{message}</p>
		</div>
	);
}

export default Register;
