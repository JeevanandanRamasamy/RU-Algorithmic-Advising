import { useState, useEffect, useCallback } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useTakenCourses = setAvailableCourses => {
	const [takenCourses, setTakenCourses] = useState([]);
	const [takenCoursesLoading, setTakenCoursesLoading] = useState(false);
	const [takenCoursesError, setTakenCoursesError] = useState(null);
	const [searchTaken, setSearchTaken] = useState("");

	const fetchTakenCourses = useCallback(async () => {
		setTakenCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record/taken`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setTakenCourses(data.taken_courses ? data.taken_courses : []);
			setAvailableCourses(prevAvailableCourses =>
				prevAvailableCourses.filter(
					course => !takenCourses.some(taken => taken.course_id === course.course_id)
				)
			);
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
			console.log("data", data);
			if (!response.ok) {
				console.error("Error adding course to the plan:", data.message);
				setTakenCoursesError(data.message);
			} else {
				setTakenCourses(prevCourses => [...prevCourses, data.taken_course]);
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
				setPlanId(data?.taken_courses?.length > 0 ? data.taken_courses[0].plan_id : planId);
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
