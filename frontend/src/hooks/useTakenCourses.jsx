import { useState, useEffect, useCallback } from "react";

const useTakenCourses = (backendUrl, token) => {
	const [takenCourses, setTakenCourses] = useState([]);
	const [takenCoursesLoading, setTakenCoursesLoading] = useState(false);
	const [takenCoursesError, setTakenCoursesError] = useState(null);

	const fetchCourses = useCallback(async () => {
		setTakenCoursesLoading(true);
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
			setTakenCoursesLoading(false);
		}
	}, [backendUrl, token]);
	return <div>useTakenCourses</div>;
};

export default useTakenCourses;
