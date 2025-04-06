// import React, { useState, useEffect, useCallback } from "react";
// import "../css/DragDrop.css";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

export const AvailableCourses = ({
	// searchAvailable,
	// setSearchAvailable,
	courses,
	getCourse,
	isHorizontal = true
	// excludedCourseIds
}) => {
	// const filteredCourses = filteredCourses
	// 	? filteredCourses.filter(course => !excludedCourseIds.includes(course.course_id))
	// 	: [];
export const AvailableCourses = ({ courses, getCourse, limit }) => {
	return (
		<div
			className={`non-draggable h-full border border-gray-200 rounded-md p-2.5 flex ${
				isHorizontal ? "flex-row" : "flex-col"
			} gap-3 overflow-x-auto overflow-y-hidden`}>
			<CourseList
				courses={courses}
				getCourse={getCourse}
				CourseItemComponent={CourseItem}
			/>
		<div className="p-2">
			<div
				className={`non-draggable border border-gray-200 rounded-md flex flex-row gap-3 overflow-x-auto overflow-y-hidden h-[200px] p-2`}>
				<CourseList
					courses={courses}
					getCourse={getCourse}
					CourseItemComponent={CourseItem}
					limit={limit}
				/>
			</div>
		</div>
	);
};

export default AvailableCourses;
