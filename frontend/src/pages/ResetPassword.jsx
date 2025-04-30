import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ResetPassword() {
    const [step, setStep] = useState(1); // Step 1: Enter Username, Step 2: Verify Code & Set Password
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Request Reset Code
    const handleRequestReset = async () => {
        setMessage("");
        if (!username) {
            setMessage("Please enter your Rutgers NetID.");
            return;
        }
        setLoading(true);

        const validateResponse = await fetch(`${backendUrl}/api/validate_username`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        const validateData = await validateResponse.json();
        if (validateData.status !== "success") {
            setMessage("Invalid username. Account does not exist.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/send-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Reset code sent to your Rutgers email!");
                setStep(2); // Move to Step 2
            } else {
                setMessage(data.message || "Error sending reset code.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify Code & Reset Password
    const handleVerifyAndReset = async () => {
        setMessage("");

        if (!code) {
            setMessage("Please enter the verification code.");
            return;
        }
        if (code.length !== 6) {
            setMessage("Verification code must be 6 digits.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }
        if (!password || !confirmPassword) {
            setMessage("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
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
                body: JSON.stringify({ username, code }),
            });

            const verifyData = await verifyResponse.json();
            console.log("OTP Verification Response:", verifyData);

            if (!verifyData.success) {
                console.log("OTP verification failed.");
                setMessage("Invalid verification code, please try again.");
                return;
            }
            console.log("OTP verified successfully! Proceeding with password reset...");

            // Step 2: Reset Password
            const resetResponse = await fetch(`${backendUrl}/api/reset_password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    new_password: password,
                }),
            });

            const resetData = await resetResponse.json();
            console.log("Reset Password Response:", resetData);

            if (
                resetData.status === "success" ||
                resetData.message === "Password Reset successful"
            ) {
                console.log(
                    "Password Reset successful! Updating message and scheduling redirect..."
                );

                setMessage("Password Reset successful! Redirecting to login...");

                // Ensure the message is updated before redirecting
                setTimeout(() => {
                    console.log("Redirecting to login...");

                    navigate("/"); // Redirect after showing the message
                }, 2000);
            } else {
                console.log("Password Reset failed.");
                setMessage(resetData.message || "Password Reset failed.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>

            {step === 1 && (
                <div>
                    <h3>Enter Your Rutgers NetID</h3>
                    <form onSubmit={handleRequestReset}>
                        <input
                            type="text"
                            placeholder="Enter your NetID (e.g., abc123)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button onClick={handleRequestReset} disabled={loading}>
                            {loading ? "Sending..." : "Send Code"}
                        </button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h3>Verify Code & Set New Password</h3>
                    <form onSubmit={handleVerifyAndReset}>
                        <input
                            type="text"
                            placeholder="Enter Verification Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="New Password"
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
                        <button onClick={handleVerifyAndReset} disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            )}

            {message && <p>{message}</p>}

            <p>
                Go back to <Link to={"/"}>Login</Link>
            </p>
        </div>
    );
}

export default ResetPassword;