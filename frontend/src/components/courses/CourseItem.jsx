import React, { useEffect } from "react";
import { useDrag } from "react-dnd";

const CourseItem = ({ course, isPlanned = false }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "COURSE",
		item: { id: course.course_id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		}),
		canDrag: !isPlanned // Disable drag when the course is already planned
	}));

	// Log the course ID when the drag starts
	useEffect(() => {
		if (isDragging) {
			console.log(`Dragging course: ${course.course_name} (ID: ${course.course_id})`);
		}
	}, [isDragging, course]);

	return (
		<div
			ref={drag}
			className={`course-item ${isDragging ? "dragging" : ""} ${isPlanned ? "planned" : ""}`}
			style={{ opacity: isDragging ? 0.5 : 1 }}>
			<h3 className="course-title">{course.course_name}</h3>
			<p className="course-code">ID: {course.course_id}</p>
			<p className="course-credits">{course.credits} credits</p>
			<a
				className="course-link"
				href={course.course_link}
				target="_blank"
				rel="noopener noreferrer">
				Course Details
			</a>
		</div>
	);
};

export default CourseItem;
