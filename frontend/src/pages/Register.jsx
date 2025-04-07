import RegisterFlow from "../components/register/RegisterFlow";
import logo from "../assets/minilogo.png"; // optional logo
import { Link } from "react-router-dom";
import React from "react";
import backgroundImage from "../assets/welcome.jpg";
import "../css/pages.css";

const Register = () => {
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      {/* Left: Form */}
      <div className="w-2/3 h-screen flex items-center justify-center">
        <div className="w-full max-w-lg p-8 flex flex-col items-center">
          <div className="mb-4">
            <img src={logo} alt="Logo" className="w-32 h-32" />
          </div>
          <header className="mb-4 text-center">
            <h1 className="text-2xl font-bold">Create Your Account</h1>

            <p className="text-sm text-gray-500">
              Start scheduling smarter today
            </p>
          </header>
          <RegisterFlow />
          <p className="text-sm text-gray-500">
            Already have an account?
            <Link to="/" className="text-blue-500 hover:underline">
              Log in here.
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Design placeholder */}
      <div className="w-1/3 h-screen bg-red-500 flex items-center justify-center text-white registration-bg">
        {/* You could use this space for an image, graphic, or quote */}
        <p className="text-xl font-semibold">RU Super Scheduler</p>
      </div>
    </div>
  );
};

export default Register;
