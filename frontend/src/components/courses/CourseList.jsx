import React from "react";

const CourseList = ({
	courses = [],
	getCourse = course => course,
	CourseItemComponent,
	courseItemProps,
	limit
}) => {
	const visibleCourses = limit ? courses.slice(0, limit) : courses;
	return (
		<>
			{visibleCourses.map(course => (
				<CourseItemComponent
					key={getCourse(course).course_id}
					course={getCourse(course)}
					{...courseItemProps}
				/>
			))}
		</>
	);
};

export default CourseList;
