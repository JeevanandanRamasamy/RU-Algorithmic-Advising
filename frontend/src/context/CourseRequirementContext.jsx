import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CourseRequirementsContext = createContext();

export const CourseRequirementsProvider = ({ children }) => {
	const { token } = useAuth();
	const [coursesWithMissingRequirements, setCoursesWithMissingRequirements] = useState({});

	const fetchPlannedCoursesWithMissingRequirements = useCallback(async () => {
		if (!token) return;

		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_BACKEND_URL
				}/api/users/requirements/planned-courses/missing`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				}
			);
			const data = await response.json();
			setCoursesWithMissingRequirements(data.courses_missing_requirements || {});
		} catch (error) {
			console.error("Error fetching missing requirements for planned courses", error);
		}
	}, [token]);

	useEffect(() => {
		fetchPlannedCoursesWithMissingRequirements();
	}, [fetchPlannedCoursesWithMissingRequirements]);

	return (
		<CourseRequirementsContext.Provider
			value={{ coursesWithMissingRequirements, fetchPlannedCoursesWithMissingRequirements }}>
			{children}
		</CourseRequirementsContext.Provider>
	);
};

export const useCourseRequirements = () => useContext(CourseRequirementsContext);
