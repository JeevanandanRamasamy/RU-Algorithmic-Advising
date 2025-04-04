import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useCourseRecords = () => {
	const { user, token } = useAuth();
	const [courseRecords, setCourseRecords] = useState([]);
	const [coursesRecordsLoading, setCoursesRecordsLoading] = useState(false);
	const [coursesRecordsError, setCourseRecordsError] = useState(null);
	const courseRecordsRef = useRef(courseRecords);

	const fetchCourseRecords = async () => {
		setCoursesRecordsLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
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
	};
	// useEffect(() => {
	// 	if (token) {
	// 		fetchPlannedCourses();
	// 	}
	// }, []);

	// const fetchTakenCourses = async () => {
	// 	coursesRecordsLoading(true);
	// 	try {
	// 		const response = await fetch(`${backendUrl}/api/users/course_record/taken`, {
	// 			headers: {
	// 				Authorization: `Bearer ${localStorage.getItem("token")}`
	// 			}
	// 		});
	// 		if (!response.ok) throw new Error("Failed to fetch courses");

	// 		const data = await response.json();
	// 		setTakenCourses(data.taken_courses ? data.taken_courses : []);
	// 	} catch (err) {
	// 		setCourseRecordsError(err.message);
	// 		console.error("Error fetching courses:", err);
	// 	} finally {
	// 		setTakenCoursesLoading(false);
	// 	}
	// };

	// useEffect(() => {
	// 	if (courseRecords.length > 0) {
	// 		// Call handleAddCourseRecord here or other logic that depends on courseRecords
	// 		console.log("courseRecords updated:", courseRecords);
	// 	}
	// }, [courseRecords]); // This will run when courseRecords changes
	const handleAddCourseRecord = async (courseId, term, year) => {
		console.log(courseRecordsRef);
		const existingCourse = courseRecordsRef.current.find(
			course => course?.course_info?.course_id === courseId
		);

		const method = existingCourse ? "PUT" : "POST";
		console.log(existingCourse);
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ course_id: courseId, term: term, year: year })
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error adding course to the plan:", data.message);
				setCourseRecordsError(data.message);
			} else {
				// fetchCourseRecords();
				//
				setCourseRecords(prevCourses => {
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
			} /* else {
				setCourseRecords(prevCourses => {
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
			} */
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
				body: JSON.stringify({
					course_id: courseId
				})
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error removing course:", data.message);
				setCourseRecordsError(data.message);
				// If there's an error, restore the previous state by re-fetching
				// await fetchPlannedCourses();
			} else {
				setCourseRecords(prevPlannedCourses =>
					prevPlannedCourses.filter(course => course.course_info.course_id !== courseId)
				);
				// fetchCourseRecords();
			} /* else {
			} */
		} catch (error) {
			console.error("Error removing course from the plan:", error);
			// In case of an error, restore the previous state
			// await fetchPlannedCourses();
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
