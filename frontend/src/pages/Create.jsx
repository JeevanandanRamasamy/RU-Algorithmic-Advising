import React from "react";
import { Link } from "react-router-dom";

/**
 * Create Component
 *
 * This component renders a link that navigates the user to the "/questionnaire" route.
 * The link is styled with a background color of red.
 */
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
