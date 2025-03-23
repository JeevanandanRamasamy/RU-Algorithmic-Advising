import { useState, useEffect, useCallback } from "react";

const usePlannedCourses = (backendUrl, token) => {
	const [plannedCourses, setPlannedCourses] = useState([]);
	const [plannedCoursesLoading, setPlannedCoursesLoading] = useState(false);
	const [plannedCoursesError, setPlannedCoursesError] = useState(null);

	const [searchPlannedQuery, setSearchPlannedQuery] = useState("");
	const [planId, setPlanId] = useState(null);

	const fetchPlannedCourses = useCallback(async () => {
		setPlannedCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/users/planned_courses`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setPlannedCourses(data.planned_courses ? data.planned_courses : []);
			const planIdValue = data?.planned_courses[0]?.plan_id || planId || null;
			console.log("Assigned planId:", planIdValue);
			setPlanId(planIdValue);
		} catch (err) {
			setPlannedCoursesError(err.message);
			console.error("Error fetching courses:", err);
		} finally {
			setPlannedCoursesLoading(false);
		}
	}, [backendUrl, token]);
	useEffect(() => {
		if (token) {
			fetchPlannedCourses();
		}
	}, [token, fetchPlannedCourses]);

	const handleAddPlannedCourse = async courseId => {
		try {
			const response = await fetch(`${backendUrl}/api/users/planned_courses`, {
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
				setPlannedCoursesError(data.message);
			} else {
				setPlannedCourses(prevCourses => [...prevCourses, data.planned_course]);
				if (data?.plannedCourses?.length > 0) {
					setPlanId(data.planned_courses[0].plan_id);
				}
			}
		} catch (error) {
			console.error("Error adding course:", error);
			setPlannedCoursesError(error);
		}
	};

	const handleRemovePlannedCourse = async courseId => {
		setPlannedCoursesLoading(true);

		try {
			if (!planId) {
				console.log(planId);
				console.error("Plan ID is missing!");
				return;
			}

			const response = await fetch(`${backendUrl}/api/users/planned_courses`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					course_id: courseId,
					plan_id: planId
				})
			});

			const data = await response.json();
			if (!response.ok) {
				console.error("Error removing course:", data.message);
				setPlannedCoursesError(data.message);
				set;
				// If there's an error, restore the previous state by re-fetching
				// await fetchPlannedCourses();
			} else {
				setPlannedCourses(prevPlannedCourses =>
					prevPlannedCourses.filter(course => course.course_info.course_id !== courseId)
				);

				setPlanId(
					data?.planned_courses?.length > 0 ? data.planned_courses[0].plan_id : planId
				); // Only update if new plan_id is returned
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
