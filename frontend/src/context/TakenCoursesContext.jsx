import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useCourseRequirements } from "./CourseRequirementContext";
import { useStudentDetails } from "../context/StudentDetailsContext";
import { showErrorToast } from "../components/toast/Toast";

const TakenCoursesContext = createContext();

/**
 * Provides functionality and state management for handling taken courses.
 *
 * @param {React.ReactNode} children - The child components that need access to the TakenCourses context.
 */
export const TakenCoursesProvider = ({ children }) => {
	const { token } = useAuth();
	const { fetchPlannedCoursesWithMissingRequirements } = useCourseRequirements();

	const [takenCourses, setTakenCourses] = useState([]);
	const [takenCoursesLoading, setTakenCoursesLoading] = useState(false);
	const [takenCoursesError, setTakenCoursesError] = useState(null);
	const [searchTaken, setSearchTaken] = useState("");
	const { fetchUserDetails } = useStudentDetails();

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	/**
	 * Fetches the list of taken courses from the backend API.
	 * This function is called when the component mounts or when the token changes.
	 *
	 * @returns {void}
	 */
	const fetchTakenCourses = useCallback(async () => {
		setTakenCoursesLoading(true);
		try {
			const res = await fetch(`${backendUrl}/api/users/course_record/termless`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!res.ok) throw new Error("Failed to fetch courses");
			const data = await res.json();
			setTakenCourses(data.taken_courses || []);
		} catch (err) {
			setTakenCoursesError(err.message);
			console.error("Error fetching courses:", err);
			showErrorToast("Error fetching courses.");
		} finally {
			setTakenCoursesLoading(false);
		}
	}, [backendUrl, token]);

	// Fetch taken courses when the component mounts or when token changes
	useEffect(() => {
		if (token) fetchTakenCourses();
	}, [token, fetchTakenCourses]);

	/**
	 * Handles adding a course to the taken courses list.
	 *
	 * @param {string} courseId - The ID of the course to add.
	 * @returns {void}
	 */
	const handleAddTakenCourse = async courseId => {
		try {
			const res = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ course_id: courseId })
			});
			const data = await res.json();
			if (!res.ok) {
				setTakenCoursesError(data.message);
				showErrorToast("Error adding course.");
			} else {
				setTakenCourses(prev => [...prev, data.course_record.course_info]);
				fetchPlannedCoursesWithMissingRequirements?.();
				fetchUserDetails();
			}
		} catch (err) {
			console.error("Error adding course:", err);
			showErrorToast("Error adding course.");
		}
	};

	/**
	 * Handles removing a course from the taken courses list.
	 *
	 * @param {string} courseId - The ID of the course to remove.
	 * @returns {void}
	 */
	const handleRemoveTakenCourse = async courseId => {
		setTakenCoursesLoading(true);
		try {
			const res = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ course_id: courseId })
			});
			const data = await res.json();
			if (!res.ok) {
				setTakenCoursesError(data.message);
				showErrorToast("Error removing course.");
			} else {
				setTakenCourses(prev => prev.filter(c => c.course_id !== courseId));
				fetchPlannedCoursesWithMissingRequirements?.();
				fetchUserDetails();
			}
		} catch (err) {
			console.error("Error removing course:", err);
			showErrorToast("Error removing course.");
		} finally {
			setTakenCoursesLoading(false);
		}
	};

	return (
		<TakenCoursesContext.Provider
			value={{
				takenCourses,
				takenCoursesLoading,
				takenCoursesError,
				fetchTakenCourses,
				setTakenCourses,
				handleAddTakenCourse,
				handleRemoveTakenCourse,
				searchTaken,
				setSearchTaken
			}}>
			{children}
		</TakenCoursesContext.Provider>
	);
};

export const useTakenCourses = () => useContext(TakenCoursesContext);
