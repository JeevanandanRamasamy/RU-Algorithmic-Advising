import React from "react";
import { Link } from "react-router-dom";

function Create() {
	return (
		<>
			<Link
				className="bg-red-600"
				to="/questionnaire">
				Register Account
			</Link>
		</>
	);
}

export default Create;
