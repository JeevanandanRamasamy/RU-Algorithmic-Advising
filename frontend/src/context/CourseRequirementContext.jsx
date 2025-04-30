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
			setCoursesWithMissingRequirements(data.courses_missing_requirements || {});
		} catch (error) {
			console.error("Error fetching missing requirements for planned courses", error);
		}
	}, [token]);
	const checkRequirements = async courseIds => {
		try {
			const params = new URLSearchParams();
			courseIds.forEach(courseId => params.append("course", courseId));

			const response = await fetch(
				`${backendUrl}/api/users/requirements/courses?${params.toString()}`,
				{
					method: "GET",
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json"
					}
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to fetch requirements.");
			}

			return data.courses_missing_requirements;
		} catch (error) {
			console.error("Error checking requirements:", error.message);
			return { error: error.message };
		}
	};

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
				setRequirementStrings,
				checkRequirements
			}}>
			{children}
		</CourseRequirementsContext.Provider>
	);
};

export const useCourseRequirements = () => useContext(CourseRequirementsContext);
