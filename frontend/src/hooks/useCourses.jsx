import { useState, useEffect, useCallback } from "react";

const useCourses = (backendUrl, token) => {
	const [courses, setCourses] = useState([]);
	const [coursesLoading, setCoursesLoading] = useState(false);
	const [coursesError, setCoursesError] = useState(null);

	const fetchCourses = useCallback(async () => {
		setCoursesLoading(true);
		try {
			const response = await fetch(`${backendUrl}/api/courses`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setCourses(data);
		} catch (err) {
			setCoursesError(err.message);
			console.error("Error fetching courses:", err);
		} finally {
			setCoursesLoading(false);
		}
	}, [backendUrl, token]);

	useEffect(() => {
		if (token) fetchCourses();
	}, [token, fetchCourses]);

	return { courses, coursesLoading, coursesError, fetchCourses, setCourses };
};

export default useCourses;
