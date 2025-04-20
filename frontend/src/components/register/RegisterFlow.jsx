import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnterEmail from "./RegisterSteps/EnterEmail";
import VerifyOTP from "./RegisterSteps/VerifyOTP";
import SetUserDetails from "./RegisterSteps/SetUserDetails";
import {
  showSuccessToast,
  showWarningToast,
  showErrorToast,
  showInfoToast,
} from "../toast/Toast"; // adjust path if needed

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function RegisterFlow() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [resendTimer, setResendTimer] = useState(0); // Keep track of the time for resending the code
  const RESEND_DELAY = 30; // 30 second resend timer

  // Step 1: Enter Email
  const sendCode = async ({
    checkUser = false,
    goToStep2 = false,
    startTimer = false,
  } = {}) => {
    setMessage("");

    if (!username) {
      showErrorToast("Please enter your Rutgers NetID.");
      setMessage("Please enter your Rutgers NetID.");
      return;
    }

    if (username.length > 6) {
      showErrorToast("NetID should be at most 6 characters long.");
      setMessage("NetID should be at most 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (checkUser) {
        const validateResponse = await fetch(
          `${backendUrl}/api/check_username_exists`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );

        const validateData = await validateResponse.json();
        if (validateData.status !== "success") {
          showWarningToast("Account already exists");
          setMessage("Account already exists. Please login.");
          return;
        }
      }

      const response = await fetch(`${backendUrl}/api/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(
          checkUser ? "Verification code sent!" : "Verification code resent!"
        );
        showSuccessToast(
          checkUser ? "Verification code sent!" : "Code resent!"
        );
        if (goToStep2) setStep(2);
        if (startTimer) startResendTimer();
      } else {
        setMessage(data.message || "Error sending verification code.");
      }
    } catch (error) {
      showErrorToast("Network error. Please try again.");
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(RESEND_DELAY); // 30 seconds

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  // Step 2: Verify Code Only
  const handleVerifyCode = async () => {
    setMessage("");

    if (!code) {
      setMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const verifyResponse = await fetch(`${backendUrl}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      });

      const verifyData = await verifyResponse.json();
      console.log("OTP Verification Response:", verifyData);

      if (!verifyData.success) {
        setMessage("Invalid verification code, please try again.");
        return;
      }

      // ✅ Only advance to Step 3 if verified
      setStep(3);
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Final registration after code is verified
  const handleRegisterUser = async () => {
    setMessage("");

    if (!password || !confirmPassword || !firstName || !lastName) {
      setMessage("All fields are required.");
      showWarningToast("All Fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      showWarningToast("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const registerData = await registerResponse.json();

      if (
        registerData.status === "success" ||
        registerData.message === "Registration successful"
      ) {
        setMessage("");
        showSuccessToast("Registration successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(registerData.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {step === 1 && (
        <EnterEmail
          username={username}
          setUsername={setUsername}
          onNext={() => sendCode({ checkUser: true, goToStep2: true })}
          loading={loading}
        />
      )}
      {step === 2 && (
        <VerifyOTP
          username={username}
          code={code}
          setCode={setCode}
          onNext={handleVerifyCode}
          onBack={() => setStep(1)} // Go back to Step 1
          onResend={() => sendCode({ startTimer: true })} // Start cooldown
          resendTimer={resendTimer}
        />
      )}
      {step === 3 && (
        <SetUserDetails
          username={username}
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          onRegister={handleRegisterUser} // ✅ registration only
          loading={loading}
        />
      )}
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
