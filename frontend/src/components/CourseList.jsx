import React from "react";
import CourseItem from "./CourseItem";

// const CourseList = ({ courses, onDrop, plannedCourseIds = [] }) => {
// const CourseList = ({ courses, onDrop, filteredCourseIds = [] }) => {
const CourseList = ({ courses, onDrop }) => {
	// const availableCourses = courses.filter(
	// 	course => !filteredCourseIds.includes(course.course_id)
	// );
	console.log(courses);
	return (
		<div className="course-list">
			{courses.length > 0 ? (
				<>
					{(() => {
						const items = [];
						for (let i = 0; i < Math.min(50, courses.length); i++) {
							items.push(
								<CourseItem
									key={courses[i].course_id}
									course={courses[i]}
								/>
							);
						}
						return items;
					})()}
				</>
			) : (
				// // courses.map(course => (
				// courses.slice(0, 50).map(course => (
				// 	<CourseItem
				// 		key={course.course_id}
				// 		course={course}
				// 	/>
				// ))
				<div className="no-courses">No available courses found</div>
			)}
		</div>
	);
};

export default CourseList;
