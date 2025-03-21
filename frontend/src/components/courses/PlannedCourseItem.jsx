import React from "react";

const PlannedCourseItem = ({ course, onRemove }) => {
	return (
		<div className="planned-course-item">
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
