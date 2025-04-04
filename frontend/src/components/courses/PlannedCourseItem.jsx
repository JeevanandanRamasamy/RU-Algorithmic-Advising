import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { useState } from "react";

const PlannedCourseItem = ({ course, onRemove }) => {
	const [scrolling, setScrolling] = useState(false);
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

	useEffect(() => {
		const handleWheel = e => {
			if (scrolling) {
				e.preventDefault();
				document.documentElement.scrollTop += e.deltaY;
			}
		};

		if (isDragging) {
			window.addEventListener("wheel", handleWheel, { passive: false });
		} else {
			window.removeEventListener("wheel", handleWheel);
		}

		return () => {
			window.removeEventListener("wheel", handleWheel);
		};
	}, [isDragging, scrolling]);
	return (
		<div
			ref={drag}
			className={`planned-course-item bg-white group ${
				isDragging ? "dragging" : ""
			} planned`}>
			<h3 className="planned-course-name m-0">
				<a
					className="no-underline text-black hover:text-blue-500"
					href={course.course_link}
					target="_blank"
					rel="noopener noreferrer">
					{course.course_name}
				</a>
			</h3>
			<p className="planned-course-code m-0">ID: {course.course_id}</p>
			<div className="flex justify-between">
				<p className="planned-course-credits m-0 text-center">{course.credits} credits</p>
				<button
					className="bg-[#f44336] text-white border-none px-2.5 py-1 rounded cursor-pointer invisible group-hover:visible transition-opacity duration-200 hover:bg-[#d32f2f]"
					onClick={() => onRemove(course.course_id)}>
					Remove
				</button>
			</div>
		</div>
	);
};

export default PlannedCourseItem;
