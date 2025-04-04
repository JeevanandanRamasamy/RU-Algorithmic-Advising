import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const usePlannedCourses = () => {
	const { user, token } = useAuth();
	const [plannedCourses, setPlannedCourses] = useState([]);
	const [plannedCoursesLoading, setPlannedCoursesLoading] = useState(false);
	const [plannedCoursesError, setPlannedCoursesError] = useState(null);
	const [searchPlannedQuery, setSearchPlannedQuery] = useState("");

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
	useEffect(() => {
		if (token) {
			fetchPlannedCourses();
		}
	}, []);

	const handleAddCourse = async (courseId, term, year, type) => {
		try {
			const config = {
				taken: {
					setCourses: setTakenCourses
				},
				planned: {
					setCourses: setPlannedCourses
				}
			};
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

	const handleRemoveCourse = async (courseId, type) => {
		setPlannedCoursesLoading(true);

		try {
			// if (!planId) {
			// 	// console.log(planId);
			// 	console.error("Plan ID is missing!");
			// 	return;
			// }

			const response = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					course_id: courseId
					// plan_id: planId
				})
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error removing course:", data.message);
				plannedCoursesError(data.message);
				set;
				// If there's an error, restore the previous state by re-fetching
				// await fetchPlannedCourses();
			} else {
				setPlannedCourses(prevPlannedCourses =>
					prevPlannedCourses.filter(course => course.course_info.course_id !== courseId)
				);

				// setPlanId(
				// 	data?.planned_courses?.length > 0 ? data.planned_courses[0].plan_id : planId
				// ); // Only update if new plan_id is returned
			} //else {
			//console.log("Course removed successfully");
			// No need to refetch if the operation was successful
			//}
		} catch (error) {
			console.error("Error removing course from the plan:", error);
			// In case of an error, restore the previous state
			// await fetchPlannedCourses();
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
		handleAddPlannedCourse,
		handleRemovePlannedCourse
	};
};

export default usePlannedCourses;
