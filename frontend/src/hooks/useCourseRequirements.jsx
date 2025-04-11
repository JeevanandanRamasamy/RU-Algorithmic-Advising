import React, { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useCourseRequirements = () => {
	const { user, token } = useAuth();
	const [missingRequirementsForPlannedCourses, setMissingRequirementsForPlannedCourses] =
		useState({});
	const fetchMissingRequirementsForPlannedCourses = async () => {
		try {
			const response = await fetch(
				`${backendUrl}/api/users/requirements/planned-courses/missing`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				}
			);
			console.log(response);
		} catch (error) {
			console.error("Error fetching missing requirements for planned courses", error);
		}
	};
	// fetchMissingRequirementsForPlannedCourses();

	return <div>useCourseRequirements</div>;
};

export default useCourseRequirements;
