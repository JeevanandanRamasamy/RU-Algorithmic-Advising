import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useCourseRecords = fetchPlannedCoursesWithMissingRequirements => {
	const { user, token } = useAuth();
	const [courseRecords, setCourseRecords] = useState([]);
	const [coursesRecordsLoading, setCoursesRecordsLoading] = useState(false);
	const [coursesRecordsError, setCourseRecordsError] = useState(null);
	const courseRecordsRef = useRef(courseRecords);

	const fetchCourseRecords = useCallback(async () => {
		setCoursesRecordsLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record/terms`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setCourseRecords(data.course_records ? data.course_records : []);
		} catch (err) {
			setCourseRecordsError(err.message);
			console.error("Error fetching courses:", err);
		} finally {
			setCoursesRecordsLoading(false);
		}
	}, [backendUrl]);

	const handleAddCourseRecord = async (courseId, term, year) => {
		const existingCourse = courseRecordsRef.current.find(
			course => course?.course_info?.course_id === courseId
		);

		const method = existingCourse ? "PUT" : "POST";

		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ course_id: courseId, term, year })
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error adding course to the plan:", data.message);
				setCourseRecordsError(data.message);
			} else {
				setCourseRecords(prevCourses => {
					const courseIndex = prevCourses.findIndex(
						course => course?.course_info?.course_id === courseId
					);
					if (courseIndex !== -1) {
						const updatedCourses = [...prevCourses];
						updatedCourses[courseIndex] = {
							...updatedCourses[courseIndex],
							term,
							year
						};
						return updatedCourses;
					} else {
						return [...prevCourses, data.course_record];
					}
				});

				fetchPlannedCoursesWithMissingRequirements();
			}
		} catch (error) {
			console.error("Error adding course:", error);
			setCourseRecordsError(error);
		}
	};

	const handleRemoveCourseRecord = async courseId => {
		setCoursesRecordsLoading(true);

		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ course_id: courseId })
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error removing course:", data.message);
				setCourseRecordsError(data.message);
			} else {
				setCourseRecords(prevPlannedCourses =>
					prevPlannedCourses.filter(course => course.course_info.course_id !== courseId)
				);

				fetchPlannedCoursesWithMissingRequirements();
			}
		} catch (error) {
			console.error("Error removing course from the plan:", error);
		} finally {
			setCoursesRecordsLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchCourseRecords();
		}
	}, []);

	useEffect(() => {
		courseRecordsRef.current = courseRecords;
	}, [courseRecords]);

	return {
		courseRecords,
		setCourseRecords,
		coursesRecordsLoading,
		setCoursesRecordsLoading,
		coursesRecordsError,
		setCourseRecordsError,
		handleAddCourseRecord,
		handleRemoveCourseRecord
	};
};

export default useCourseRecords;
