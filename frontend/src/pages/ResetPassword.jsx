import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/minilogo.png";
import welcomeImg from "../assets/welcome.jpg";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ResetPassword() {
  const [step, setStep] = useState(1); // Step 1: Enter Username, Step 2: Verify Code & Set Password
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request Reset Code
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!username.trim()) {
      setMessage("Please enter your Rutgers NetID.");
      return;
    }
    setLoading(true);

    try {
      const validateResponse = await fetch(
        `${backendUrl}/api/validate_username`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );
      const validateData = await validateResponse.json();
      if (validateData.status !== "success") {
        setMessage("Invalid username. Account does not exist.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${backendUrl}/api/send-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage("Reset code sent to your Rutgers email!");
        setStep(2);
      } else {
        setMessage(data.message || "Error sending reset code.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code & Reset Password
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!code.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }
    if (code.trim().length !== 6) {
      setMessage("Verification code must be 6 digits.");
      return;
    }
    if (!password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Verify code
      const verifyResponse = await fetch(
        `${backendUrl}/api/verify-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, code }),
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        setMessage("Invalid verification code, please try again.");
        setLoading(false);
        return;
      }

      // Reset password
      const resetResponse = await fetch(
        `${backendUrl}/api/reset_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, new_password: password }),
        }
      );
      const resetData = await resetResponse.json();
      if (
        resetData.status === "success" ||
        resetData.message === "Password Reset successful"
      ) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(resetData.message || "Password reset failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="flex flex-col justify-center flex-1 px-8 py-12 lg:px-24">
        <img src={logo} alt="RU Super Scheduler" className="w-20 mx-auto" />
        <h1 className="mt-6 text-3xl font-bold text-center">
          Reset Your Password
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Let’s get you back in
        </p>

        {message && (
          <div className="mt-6 text-center text-red-600">{message}</div>
        )}

        <div className="mt-8 space-y-6">
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Step 1: Enter Your NetID
              </label>
              <input
                type="text"
                placeholder="e.g., abc123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Step 2: Verify Code & Set New Password
              </label>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Go back to{' '}
          <Link
            to="/"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Right: Hero Image */}
      <div className="hidden lg:block flex-1">
        <img
          src={welcomeImg}
          alt="RU Super Scheduler Welcome"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
