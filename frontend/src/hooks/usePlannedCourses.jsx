import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Custom hook for managing planned courses.
 * This hook handles fetching, adding, removing, and searching courses.
 */
const usePlannedCourses = () => {
	const { user, token } = useAuth();
	const [plannedCourses, setPlannedCourses] = useState([]);
	const [plannedCoursesLoading, setPlannedCoursesLoading] = useState(false);
	const [plannedCoursesError, setPlannedCoursesError] = useState(null);
	const [searchPlannedQuery, setSearchPlannedQuery] = useState("");

	/**
	 * Custom hook for managing planned courses.
	 * This hook handles fetching, adding, removing, and searching courses.
	 */
	const fetchPlannedCourses = async () => {
		setPlannedCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record/planned`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setPlannedCourses(data.planned_courses ? data.planned_courses : []);
		} catch (err) {
			setPlannedCoursesError(err.message);
			console.error("Error fetching courses:", err);
		} finally {
			setPlannedCoursesLoading(false);
		}
	};
	// Fetch planned courses when the component mounts or token changes
	useEffect(() => {
		if (token) {
			fetchPlannedCourses();
		}
	}, []);

	/**
	 * Adds a new course to the planned courses list.
	 * If the course already exists, it updates the term and year.
	 *
	 * @param {string} courseId - The ID of the course to be added.
	 * @param {string} term - The term (e.g., Fall, Spring) for the course.
	 * @param {number} year - The year to assign to the course.
	 * @param {string} type - The type of course (e.g., 'planned' or 'taken').
	 */
	const handleAddCourse = async (courseId, term, year, type) => {
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ course_id: courseId, term: term, year: year })
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error adding course to the plan:", data.message);
				plannedCoursesError(data.message);
			} else {
				const setCourses = type ? setPlannedCourses : setTakenCourses;
				setCourses(prevCourses => {
					const courseIndex = prevCourses.findIndex(
						course => course?.course_info?.course_id === courseId
					);
					if (courseIndex !== -1) {
						const updatedCourses = [...prevCourses];
						updatedCourses[courseIndex] = {
							...updatedCourses[courseIndex],
							term: term,
							year: year
						};
						return updatedCourses;
					} else {
						return [...prevCourses, data.course_record];
					}
				});
			}
		} catch (error) {
			console.error("Error adding course:", error);
			setPlannedCoursesError(error);
		}
	};

	/**
	 * Updates the list of planned courses by either modifying an existing course or adding a new one.
	 *
	 * @param {string} courseId - The ID of the course to update or add.
	 * @param {string} term - The new term to assign to the course.
	 * @param {number} year - The new year to assign to the course.
	 * @param {object} courseData - The course data returned from the API.
	 */
	const handleRemoveCourse = async (courseId, type) => {
		setPlannedCoursesLoading(true);

		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					course_id: courseId
				})
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error removing course:", data.message);
				plannedCoursesError(data.message);
			} else {
				setPlannedCourses(prevPlannedCourses =>
					prevPlannedCourses.filter(course => course.course_info.course_id !== courseId)
				);
			}
		} catch (error) {
			console.error("Error removing course from the plan:", error);
		} finally {
			setPlannedCoursesLoading(false);
		}
	};

	return {
		plannedCourses,
		plannedCoursesLoading,
		plannedCoursesError,
		fetchPlannedCourses,
		setPlannedCourses,
		searchPlannedQuery,
		setSearchPlannedQuery,
		handleAddCourse,
		handleRemoveCourse
	};
};

export default usePlannedCourses;
