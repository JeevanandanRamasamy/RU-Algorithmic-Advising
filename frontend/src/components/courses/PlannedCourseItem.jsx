import React, { useEffect } from "react";
import { useDrag } from "react-dnd";

const PlannedCourseItem = ({ course, onRemove }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "COURSE",
		item: { id: course.course_id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		}),
		canDrag: true
	}));

	useEffect(() => {
		if (isDragging) {
			console.log(`Dragging course: ${course.course_name} (ID: ${course.course_id})`);
		}
	}, [isDragging, course]);

	return (
		<div
			ref={drag}
			className={`planned-course-item bg-white ${isDragging ? "dragging" : ""} planned`}>
			<h3 className="planned-course-name">{course.course_name}</h3>
			<p className="planned-course-code"> ID: {course.course_id}</p>
			<p className="planned-course-credits">{course.credits} credits</p>
			<a
				className="planned-course-link"
				href={course.course_link}
				target="_blank"
				rel="noopener noreferrer">
				Course Details
			</a>
			<button
				className="planned-course-remove"
				onClick={() => onRemove(course.course_id)}>
				Remove
			</button>
		</div>
	);
};

export default PlannedCourseItem;
