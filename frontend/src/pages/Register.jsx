import React from "react";
import { Link } from "react-router-dom";

function Register() {
	return (
		<>
			<div className="flex flex-col">
				<Link to="/">LOGIN</Link>
				<Link to="/questionnaire">Register Account</Link>
			</div>
			;
		</>
	);
}

export default Register;
