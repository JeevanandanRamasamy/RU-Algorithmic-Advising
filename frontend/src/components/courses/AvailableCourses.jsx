// import React, { useState, useEffect, useCallback } from "react";
// import "../css/DragDrop.css";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

export const AvailableCourses = ({
	// searchAvailable,
	// setSearchAvailable,
	courses,
	getCourse
	// excludedCourseIds
}) => {
	// const filteredCourses = filteredCourses
	// 	? filteredCourses.filter(course => !excludedCourseIds.includes(course.course_id))
	// 	: [];
	return (
		// <section className="available-courses">
		// 	<h2>Available Courses</h2>
		// 	<div className="search-container">
		// 		<input
		// 			type="text"
		// 			id="search-courses"
		// 			placeholder="Search courses"
		// 			value={searchAvailable}
		// 			onChange={e => {
		// 				setSearchAvailable(e.target.value);
		// 			}}
		// 		/>
		// 	</div>
		<CourseList
			courses={courses}
			getCourse={getCourse}
			CourseItemComponent={CourseItem}
		/>
		// </section>
	);
};

export default AvailableCourses;
