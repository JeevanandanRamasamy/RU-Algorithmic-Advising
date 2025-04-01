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
		<div
			className={`non-draggable h-full border border-gray-200 rounded-md p-2.5 flex flex-row gap-3 overflow-x-auto overflow-y-hidden`}>
			<CourseList
				courses={courses}
				getCourse={getCourse}
				CourseItemComponent={CourseItem}
			/>
		</div>
	);
};

export default AvailableCourses;
