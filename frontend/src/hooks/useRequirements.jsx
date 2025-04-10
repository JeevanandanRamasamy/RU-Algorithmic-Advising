import React, { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useRequirements = () => {
	const [requirementStrings, setRequirementStrings] = useState({});

	const getRequirementsStrings = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/users/requirements/string`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});
			const data = await response.json();
			console.log(data);
			if (response.ok) {
				setRequirementStrings(data.course_requirements_string);
				console.log(data); // You can log the data for debugging
			} else {
				console.error("Failed to fetch requirements.");
			}
		} catch (error) {
			console.error("Error fetching requirements:", error);
		}
	};

	useEffect(() => {
		getRequirementsStrings();
	}, []);

	const validateSchedule = async (semesters, courseRecords, takenCourses) => {
		const invalidIds = new Set();
		const takenSoFar = new Set(
			takenCourses ? takenCourses.map(takenCourse => takenCourse.course_id) : []
		);
		const groupedCourses = groupCoursesBySemester(courseRecords);
		for (const semester of semesters) {
			const key = `${semester.term}:${semester.year}`;
			const coursesThisSemester = groupedCourses.get(key) || [];
			const response = await fetch("/api/users/requirements", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					courses_to_check: coursesThisSemester,
					taken_courses: Array.from(takenSoFar)
				})
			});
			// const data = await response.json();
			//TODO: push all invalids ids to invalidsIDs
			//TODO: update takenSoFar by coursesThisSemesters
		}
	};

	const groupCoursesBySemester = courseRecords => {
		const grouped = new Map();
		for (const record of courseRecords) {
			const key = `${record.term}:${record.year}`;
			if (!grouped.has(key)) grouped.set(key, []);
			grouped.get(key).push(record.course_info.course_id);
		}
		return grouped;
	};
	return { requirementStrings, validateSchedule };
};

export default useRequirements;
