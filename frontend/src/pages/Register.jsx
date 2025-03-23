import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
	const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Verify OTP & Set Password
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState(""); // Auto-generated from email
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); // Redirect after successful registration

	// Step 1: Send Verification Code
	const handleSendVerification = async () => {
		setMessage("");

		if (!email.endsWith("rutgers.edu")) {
			setMessage("Invalid email. Only @rutgers.edu emails are allowed.");
			return;
		}

		setLoading(true);

		try {
			// Extract username from email (before '@')
			const extractedUsername = email.split("@")[0];
			setUsername(extractedUsername);

			const response = await fetch(`${backendUrl}/api/send-verification`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (data.success) {
				setMessage("Verification code sent to your email!");
				setStep(2); // Move to the next step
			} else {
				setMessage(data.message || "Error sending verification code.");
			}
		} catch (error) {
			console.error("Error:", error);
			setMessage("Network error. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Step 2: Verify Code & Register User
	const handleVerifyAndRegister = async () => {
		setMessage("");

		console.log("Starting verification process...");

		if (!code) {
			console.log("No code entered.");
			setMessage("Please enter the verification code.");
			return;
		}

		if (!password || !confirmPassword || !firstName || !lastName) {
			console.log("Missing required fields.");
			setMessage("All fields are required.");
			return;
		}

		if (password !== confirmPassword) {
			console.log("Passwords do not match.");
			setMessage("Passwords do not match.");
			return;
		}

		setLoading(true);

		try {
			console.log("Sending verification request to backend...");

			// Step 1: Verify OTP
			const verifyResponse = await fetch(`${backendUrl}/api/verify-code`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code }),
			});

			const verifyData = await verifyResponse.json();
			console.log("OTP Verification Response:", verifyData);

			if (!verifyData.success) {
				console.log("OTP verification failed.");
				setMessage("Invalid verification code, please try again.");
				return;
			}

			console.log("OTP verified successfully! Proceeding with registration...");

			// Step 2: Register User
			const registerResponse = await fetch(`${backendUrl}/api/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					email,
					password,
					first_name: firstName,
					last_name: lastName,
				}),
			});

			const registerData = await registerResponse.json();
			console.log("Registration Response:", registerData);

			if (
				registerData.status === "success" ||
				registerData.message === "Registration successful"
			) {
				console.log(
					"Registration successful! Updating message and scheduling redirect..."
				);

				setMessage("Registration successful! Redirecting to login...");

				// Ensure the message is updated before redirecting
				setTimeout(() => {
					console.log("Redirecting to login...");

					navigate("/"); // Redirect after showing the message
				}, 2000);
			} else {
				console.log("Registration failed.");
				setMessage(registerData.message || "Registration failed.");
			}
		} catch (error) {
			console.error("Error:", error);
			setMessage("Network error. Please try again later.");
		} finally {
			console.log("Process complete. Resetting loading state.");
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>Register</h2>

			{step === 1 && (
				<div>
					<h3>Enter Your Email</h3>
					<input
						type="email"
						placeholder="Enter @rutgers.edu email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button onClick={handleSendVerification} disabled={loading}>
						{loading ? "Sending..." : "Send Code"}
					</button>
				</div>
			)}

			{step === 2 && (
				<div>
					<h3>Verify Code & Set Password</h3>
					<input
						type="text"
						placeholder="Enter Verification Code"
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>
					<br />
					<input type="text" value={username} disabled />{" "}
					{/* Auto-filled username */}
					<input
						type="text"
						placeholder="First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<br />
					<input
						type="text"
						placeholder="Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
					<br />
					<input
						type="password"
						placeholder="Create Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<br />
					<input
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<br />
					<button onClick={handleVerifyAndRegister} disabled={loading}>
						{loading ? "Registering..." : "Register"}
					</button>
				</div>
			)}

			{message && <p>{message}</p>}

			<p>
				Go back to
				<Link to={"/"}>Login</Link>
			</p>
		</div>
	);
}

export default Register;
