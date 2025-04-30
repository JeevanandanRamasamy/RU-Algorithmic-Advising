import React from "react";

/**
 * Renders a list of courses, showing only a limited number if specified.
 * Each course is passed to the provided CourseItemComponent for rendering,
 * along with the associated requirement string and other props.
 */
const CourseList = ({
	courses = [],
	getCourse = course => course,
	CourseItemComponent,
	courseItemProps,
	limit,
	requirementStrings
}) => {
	const visibleCourses = limit ? courses.slice(0, limit) : courses;

	return (
		<>
			{visibleCourses.map(course => (
				<CourseItemComponent
					key={getCourse(course).course_id}
					course={getCourse(course)}
					requirementString={requirementStrings[getCourse(course).course_id] || ""}
					{...courseItemProps}
				/>
			))}
		</>
	);
};

export default CourseList;
