import React, { useState } from "react";
import { useMemo } from "react";

/**
 * Custom hook to filter courses based on search queries for subject and school.
 * It allows for searching by subject, school, and a generic search term.
 */
const useFilterCourses = () => {
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
	const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	/**
	 * Derives the school code from the school search query.
	 * Assumes the format of the school query is: <schoolCode> <schoolName>
	 */
	const schoolCode = useMemo(() => {
		return schoolSearchQuery ? schoolSearchQuery.split(" ")[0] : "";
	}, [schoolSearchQuery]);

	/**
	 * Derives the subject code from the subject search query.
	 * Assumes the format of the subject query is: <subjectName> (<subjectCode>)
	 */
	const subjectCode = useMemo(() => {
		const match = subjectSearchQuery?.match(/\((\d+)\)/);
		return match ? match[1] : "";
	}, [subjectSearchQuery]);

	const limit = useMemo(() => {
		return subjectSearchQuery || schoolSearchQuery ? 200 : 50;
	}, [subjectSearchQuery, schoolSearchQuery]);

	/**
	 * Filters the courses based on the subject, school, and generic search queries.
	 * It also excludes any courses that are in the excludedCourseIds list.
	 *
	 * @param {Array} courses - The array of courses to filter
	 * @param {Array} excludedCourseIds - List of course IDs to exclude from the result
	 * @returns {Array} - The filtered list of courses
	 */
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
						? subjectCode === courseSubjectCode
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
