import React, { useState } from "react";
import DropdownItem from "../temp/DropdownItem";
import { schools, subjects } from "../../data/sas";
import DropdownWithSearch from "../temp/DropdownWithSearch";

const CourseListContainer = ({
	title = "",
	courses = [],
	excludedCourseIds = [],
	getCourse = course => course,
	CourseComponent,
	courseComponentProps,
	showFilters,
	setShowFilters
}) => {
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
	const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const schoolCode = schoolSearchQuery ? schoolSearchQuery.split(" ")[0] : "";
	const subjectCode = subjectSearchQuery ? subjectSearchQuery.match(/\((\d+)\)/) : "";

	const filteredCourses = courses
		? courses.filter(course => {
				const courseData = getCourse(course);
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

	return (
		<section className="h-full w-full bg-white border border-gray-300 rounded shadow-md flex flex-col">
			<h2 className="m-0 text-center">{title}</h2>
			<div className="w-full max-w-md mx-auto">
				<div
					className="flex items-center justify-between cursor-pointer mb-2 px-2"
					onClick={() => setShowFilters(prev => !prev)}>
					<span className="text-lg font-medium">Filters</span>
					<span
						className={`transform transition-transform duration-300 ${
							showFilters ? "rotate-180" : ""
						}`}>
						▼
					</span>
				</div>
				<div
					className={`grid gap-4 transition-all duration-300 overflow-hidden px-2 ${
						showFilters ? "max-h-[9999x] opacity-100" : "max-h-0 opacity-0"
					}`}>
					<input
						className="w-full p-[10px] border border-gray-300 rounded text-sm box-border non-draggable mx-auto focus:outline-none"
						type="text"
						id="search-courses"
						placeholder="Search courses by name or course code"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>

					<DropdownItem
						placeholder="Search by School code"
						selectedValue={schoolSearchQuery}
						onChange={e => setSchoolSearchQuery(e.target.value)}
						options={schools}
					/>
					<DropdownItem
						placeholder="Search by subject code"
						selectedValue={subjectSearchQuery}
						onChange={e => setSubjectSearchQuery(e.target.value)}
						options={subjects}
					/>
				</div>

				<CourseComponent
					courses={filteredCourses}
					getCourse={getCourse}
					limit={subjectSearchQuery || schoolSearchQuery ? undefined : 50}
					{...courseComponentProps}
				/>
			</div>
		</section>
	);
};

export default CourseListContainer;
