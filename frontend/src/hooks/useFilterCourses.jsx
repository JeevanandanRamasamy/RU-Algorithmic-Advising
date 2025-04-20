import React, { useState } from "react";
import { useMemo } from "react";

const useFilterCourses = () => {
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
	const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const schoolCode = useMemo(() => {
		return schoolSearchQuery ? schoolSearchQuery.split(" ")[0] : "";
	}, [schoolSearchQuery]);
	const subjectCode = useMemo(() => {
		const match = subjectSearchQuery?.match(/\((\d+)\)/);
		return match ? match[1] : "";
	}, [subjectSearchQuery]);
	const limit = useMemo(() => {
		return subjectSearchQuery || schoolSearchQuery ? 200 : 50;
	}, [subjectSearchQuery, schoolSearchQuery]);

	const filterCourses = (courses, excludedCourseIds = []) => {
		const filteredCourses = courses
			? courses.filter(course => {
					const courseData = course;
					const courseId = courseData?.course_id.split(":");
					const courseName = courseData.course_name.toLowerCase();

					const courseSchoolCode = courseId[0];
					const courseSubjectCode = courseId[1];

					const matchesSearchQuery =
						[...new Set(searchQuery.toLowerCase().split(" "))].every(word =>
							courseName.toLowerCase().includes(word)
						) || courseData?.course_id.includes(searchQuery);
					const matchesSchoolQuery = schoolSearchQuery
						? schoolCode === courseSchoolCode
						: true;
					const matchesSubjectQuery = subjectSearchQuery
						? subjectCode[1] === courseSubjectCode
						: true;

					return (
						!excludedCourseIds.includes(courseData.course_id) &&
						matchesSearchQuery &&
						matchesSchoolQuery &&
						matchesSubjectQuery
					);
			  })
			: [];
		return filteredCourses;
	};

	return {
		subjectSearchQuery,
		setSubjectSearchQuery,
		schoolSearchQuery,
		setSchoolSearchQuery,
		searchQuery,
		setSearchQuery,
		filterCourses,
		limit
	};
};

export default useFilterCourses;
