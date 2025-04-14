import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CourseRequirementsContext = createContext();

export const CourseRequirementsProvider = ({ children }) => {
	const { token } = useAuth();
	const [coursesWithMissingRequirements, setCoursesWithMissingRequirements] = useState({});
	const [requirementStrings, setRequirementStrings] = useState({});

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

	const getRequirementsStrings = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/users/requirements/string`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});
			const data = await response.json();
			if (response.ok) {
				setRequirementStrings(data.course_requirements_string);
			} else {
				console.error("Failed to fetch requirements.");
			}
		} catch (error) {
			console.error("Error fetching requirements:", error);
		}
	};

	useEffect(() => {
		getRequirementsStrings();
	}, []);

	useEffect(() => {
		fetchPlannedCoursesWithMissingRequirements();
	}, [fetchPlannedCoursesWithMissingRequirements]);

	return (
		<CourseRequirementsContext.Provider
			value={{
				coursesWithMissingRequirements,
				fetchPlannedCoursesWithMissingRequirements,
				requirementStrings,
				setRequirementStrings
			}}>
			{children}
		</CourseRequirementsContext.Provider>
	);
};

export const useCourseRequirements = () => useContext(CourseRequirementsContext);
