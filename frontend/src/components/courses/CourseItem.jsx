import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { useState } from "react";

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

	// Enable scroll when dragging
	// useEffect(() => {
	// 	const handleWheel = e => {
	// 		if (!isDragging) return; // Only allow scroll during dragging

	// 		const container = containerRef.current;
	// 		if (!container) return;

	// 		const scrollSpeed = 30; // scroll speed in pixels
	// 		const buffer = 50; // pixels from the edge to trigger scrolling

	// 		const { clientX, clientY } = e;

	// 		// Scroll if near the edges
	// 		if (clientY < buffer) {
	// 			container.scrollTop -= scrollSpeed; // Scroll up
	// 		} else if (clientY > container.clientHeight - buffer) {
	// 			container.scrollTop += scrollSpeed; // Scroll down
	// 		}

	// 		if (clientX < buffer) {
	// 			container.scrollLeft -= scrollSpeed; // Scroll left
	// 		} else if (clientX > container.clientWidth - buffer) {
	// 			container.scrollLeft += scrollSpeed; // Scroll right
	// 		}

	// 		e.preventDefault(); // Prevent default wheel action
	// 	};

	// 	if (isDragging) {
	// 		window.addEventListener("wheel", handleWheel, { passive: false });
	// 	} else {
	// 		window.removeEventListener("wheel", handleWheel);
	// 	}

	// 	return () => {
	// 		window.removeEventListener("wheel", handleWheel);
	// 	};
	// }, [isDragging]);

	// useEffect(() => {
	// 	const handleMouseMove = e => {
	// 		if (isDragging) {
	// 			window.scrollBy(0, e.movementY); // Scroll the page based on mouse movement
	// 		}
	// 	};

	// 	window.addEventListener("mousemove", handleMouseMove);

	// 	return () => {
	// 		window.removeEventListener("mousemove", handleMouseMove);
	// 	};
	// }, [isDragging]);

	return (
		<div
			ref={drag}
			className={`course-item min-w-[200px] ${isDragging ? "dragging" : ""} ${
				isPlanned ? "planned" : ""
			}`}
			style={{ opacity: isDragging ? 0.5 : 1 }}>
			<h3 className="course-title m-0 p-1 leading-6">
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
			{/* <a
				className="course-link"
				href={course.course_link}
				target="_blank"
				rel="noopener noreferrer">
				Course Details
			</a> */}
		</div>
	);
};

export default CourseItem;
