import React from "react";

import CourseList from "./CourseList";
import SemesterCourseItem from "./SemesterCourseItem";

/**
 * Renders a list of courses for a specific semester with a scrollable container.
 * It displays the courses, their requirements, and a limit to the number of courses shown.
 * Adjusts the height of the list based on whether filters are displayed.
 */
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
