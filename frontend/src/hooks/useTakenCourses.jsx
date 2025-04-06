import { useState, useEffect, useCallback } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import { useAuth } from "../context/AuthContext";

const useTakenCourses = () => {
	const { user, token } = useAuth();
	const [takenCourses, setTakenCourses] = useState([]);
	const [takenCoursesLoading, setTakenCoursesLoading] = useState(false);
	const [takenCoursesError, setTakenCoursesError] = useState(null);
	const [searchTaken, setSearchTaken] = useState("");

	const fetchTakenCourses = useCallback(async () => {
		setTakenCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record/termless`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setTakenCourses(data.taken_courses ? data.taken_courses : []);
		} catch (err) {
			setTakenCoursesError(err.message);
			console.error("Error fetching courses:", err);
		} finally {
			setTakenCoursesLoading(false);
		}
	}, [backendUrl, token]);
	useEffect(() => {
		if (token) {
			fetchTakenCourses();
		}
	}, [token, fetchTakenCourses]);

	const handleAddTakenCourse = async courseId => {
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ course_id: courseId })
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error adding course to the plan:", data.message);
				setTakenCoursesError(data.message);
			} else {
				setTakenCourses(prevCourses => [...prevCourses, data.course_record]);
			}
		} catch (error) {
			console.error("Error adding course:", error);
		}
	};

	const handleRemoveTakenCourse = async courseId => {
		setTakenCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					course_id: courseId
				})
			});
			const data = await response.json();
			if (!response.ok) {
				console.error("Error removing course:", data.message);
				setTakenCoursesError(data.message);
			} else {
				setTakenCourses(prevTakenCourses =>
					prevTakenCourses.filter(course => course.course_info.course_id !== courseId)
				);
			}
		} catch (error) {
			console.error("Error removing course from the plan:", error);
		} finally {
			setTakenCoursesLoading(false);
		}
	};

	return {
		takenCourses,
		takenCoursesLoading,
		takenCoursesError,
		fetchTakenCourses,
		setTakenCourses,
		handleAddTakenCourse,
		handleRemoveTakenCourse,
		searchTaken,
		setSearchTaken
	};
};

export default useTakenCourses;
