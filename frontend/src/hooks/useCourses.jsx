import { useState, useEffect, useCallback } from "react";

const useCourses = (backendUrl, token) => {
	const [courses, setCourses] = useState([]);
	const [coursesLoading, setCoursesLoading] = useState(false);
	const [coursesError, setCoursesError] = useState(null);
	const [searchAvailable, setSearchAvailable] = useState("");

	const fetchCourses = useCallback(async () => {
		setCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/courses`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			console.log(data);
			setCourses(data);
		} catch (err) {
			setCoursesError(err.message);
			console.error("Error fetching courses:", err);
		} finally {
			setCoursesLoading(false);
		}
	}, [backendUrl, token]);

	useEffect(() => {
		if (token) {
			fetchCourses();
		}
	}, [token, fetchCourses]);

	return {
		courses,
		coursesLoading,
		coursesError,
		fetchCourses,
		setCourses,
		searchAvailable,
		setSearchAvailable
	};
};

export default useCourses;
