import React, { useEffect, useState, useRef } from "react";
import { useDrag } from "react-dnd";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

/**
 * CourseItem component represents a single course in the UI.
 * It allows users to drag the course, display information about it,
 * and show additional requirements in a tooltip if available.
 */
const CourseItem = ({ course, isPlanned = false, requirementString }) => {
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
			className={`bg-white hover:bg-gray-100 cursor-pointer border border-[#ddd] rounded px-1.5 py-1.5 ${
				isDragging ? "dragging" : ""
			} ${isPlanned ? "planned" : ""}`}
			style={{ opacity: isDragging ? 0.5 : 1 }}>
			<h3 className="text-base m-0 p-1 leading-6">
				<a
					className="no-underline text-black hover:text-blue-500"
					href={course.course_link}
					target="_blank"
					rel="noopener noreferrer p-1">
					{course.course_name}
				</a>
			</h3>
			<p className="course-code m-0 p-1">ID: {course.course_id}</p>
			<p className="course-credits m-0 p-1">{course.credits} credits</p>

			{requirementString && (
				<>
					<a
						data-tooltip-id={`tooltip-${course.course_id}`}
						className="cursor-pointer text-blue-500 underline"
						data-tooltip-place="right">
						requirements
					</a>
					<Tooltip
						id={`tooltip-${course.course_id}`}
						className="bg-black">
						<pre className="text-sm z-10000">{requirementString}</pre>
					</Tooltip>
				</>
			)}
		</div>
	);
};

export default CourseItem;
