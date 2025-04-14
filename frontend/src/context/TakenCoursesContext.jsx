import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useCourseRequirements } from "./CourseRequirementContext";

const TakenCoursesContext = createContext();

export const TakenCoursesProvider = ({ children }) => {
	const { token } = useAuth();
	const { fetchPlannedCoursesWithMissingRequirements } = useCourseRequirements();

	const [takenCourses, setTakenCourses] = useState([]);
	const [takenCoursesLoading, setTakenCoursesLoading] = useState(false);
	const [takenCoursesError, setTakenCoursesError] = useState(null);
	const [searchTaken, setSearchTaken] = useState("");

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
		} finally {
			setTakenCoursesLoading(false);
		}
	}, [backendUrl, token]);

	useEffect(() => {
		if (token) fetchTakenCourses();
	}, [token, fetchTakenCourses]);

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
			} else {
				setTakenCourses(prev => [...prev, data.course_record.course_info]);
				fetchPlannedCoursesWithMissingRequirements?.();
			}
		} catch (err) {
			console.error("Error adding course:", err);
		}
	};

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
			} else {
				setTakenCourses(prev => prev.filter(c => c.course_id !== courseId));
				fetchPlannedCoursesWithMissingRequirements?.();
			}
		} catch (err) {
			console.error("Error removing course:", err);
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
