import React from "react";

const CourseList = ({
	courses = [],
	getCourse = course => course,
	CourseItemComponent,
	courseItemProps,
	limit,
	requirementStrings
}) => {
	const visibleCourses = limit ? courses.slice(0, limit) : courses;

	visibleCourses.map(course => {
		console.log(requirementStrings[getCourse(course).course_id] || "");
	});
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
