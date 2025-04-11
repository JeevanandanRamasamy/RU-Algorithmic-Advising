import React, { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useCourseRequirements = () => {
	const { user, token } = useAuth();
	const [coursesWithMissingRequirements, setCoursesWithMissingRequirements] = useState({});
	const fetchPlannedCoursesWithMissingRequirements = async () => {
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
			const data = await response.json();
			setCoursesWithMissingRequirements(data.courses_missing_requirements);
		} catch (error) {
			console.error("Error fetching missing requirements for planned courses", error);
		}
	};
	useEffect(() => {
		fetchPlannedCoursesWithMissingRequirements();
	}, []);

	return {
		coursesWithMissingRequirements,
		fetchPlannedCoursesWithMissingRequirements
	};
};

export default useCourseRequirements;
