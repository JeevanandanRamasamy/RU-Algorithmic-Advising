import React from "react";

import CourseList from "./CourseList";
import CourseItem from "./CourseItem";
import TakenCourseItem from "./TakenCourseItem";
import SemesterCourseItem from "./SemesterCourseItem";

export const SemesterCourses = ({ courses, getCourse, limit, showFilters, requirementStrings }) => {
	return (
		<div
			className={`p-2 overflow-y-scroll border border-gray-200 rounded-md ${
				showFilters ? "h-[600px]" : "h-[726.4px]"
			}`}>
			<CourseList
				courses={courses}
				getCourse={getCourse}
				CourseItemComponent={SemesterCourseItem}
				requirementStrings={requirementStrings}
				limit={limit}
			/>
		</div>
	);
};

export default SemesterCourses;
