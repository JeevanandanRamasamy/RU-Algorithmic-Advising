import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import PlannedCourseItem from "./PlannedCourseItem";
import CourseList from "./CourseList";

const PlannedCourses = ({ courses, getCourse, loading, error, onRemoveCourse, onAddCourse }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			onAddCourse(item.id); // Pass courseId
		},
		collect: monitor => ({
			isOver: !!monitor.isOver()
		}),
		canDrag: !isPlanned // Disable drag when the course is already planned
	}));

	return (
		<div
			ref={drop}
			className={`planned-courses-container ${isOver ? "drag-over" : ""}`}>
			{loading ? (
				<div>Loading planned courses...</div>
			) : error ? (
				<div className="error-message">{error}</div>
			) : courses?.length > 0 ? (
				// <div className="planned-courses-list">
				<CourseList
					courses={courses}
					getCourse={getCourse}
					CourseItemComponent={PlannedCourseItem}
					courseItemProps={{ onRemove: onRemoveCourse }}
				/>
			) : (
				// </div>
				<div className="no-courses-message">
					No courses planned. Drag and drop to add courses.
				</div>
			)}
		</div>
	);
};

export default PlannedCourses;
