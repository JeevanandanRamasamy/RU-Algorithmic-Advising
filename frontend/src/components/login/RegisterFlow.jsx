import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnterEmail from "./RegisterSteps/EnterEmail";
import VerifyOTP from "./RegisterSteps/VerifyOTP";
import SetUserDetails from "./RegisterSteps/SetUserDetails";

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

  const nextStep = () => setStep(step + 1);

  const handleSendVerification = async () => {
    setMessage("");
    if (!username) {
      setMessage("Please enter your Rutgers NetID.");
      return;
    }
    setLoading(true);

    try {
      const checkRes = await fetch(`${backendUrl}/api/check_username_exists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const checkData = await checkRes.json();
      if (checkData.status !== "success") {
        setMessage("Account already exists. Please login.");
        return;
      }

      const res = await fetch(`${backendUrl}/api/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Verification code sent!");
        nextStep();
      } else {
        setMessage(data.message || "Error sending code.");
      }
    } catch (error) {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    setMessage("");

    if (!code || !password || !confirmPassword || !firstName || !lastName) {
      setMessage("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const otpRes = await fetch(`${backendUrl}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      });
      const otpData = await otpRes.json();
      if (!otpData.success) {
        setMessage("Invalid code.");
        return;
      }

      const registerRes = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
      const regData = await registerRes.json();

      if (regData.status === "success") {
        setMessage("Registered! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(regData.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Network error.");
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
          onNext={handleSendVerification}
          loading={loading}
        />
      )}
      {step === 2 && (
        <VerifyOTP
          username={username}
          code={code}
          setCode={setCode}
          onNext={() => setStep(3)}
          onResend={handleSendVerification} // <- same function used earlier
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
          onRegister={handleVerifyAndRegister}
          loading={loading}
        />
      )}
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
