import React, { useEffect, useState, useRef } from "react";
import { useDrag } from "react-dnd";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const DraggableCourseItem = ({ course, isPlanned = false, requirementString }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "COURSE",
		item: { id: course.course_id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		}),
		canDrag: !isPlanned
	}));

	useEffect(() => {
		if (isDragging) {
			console.log(`Dragging course: ${course.course_name} (ID: ${course.course_id})`);
		}
	}, [isDragging, course]);

	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	// const [tooltipPosition, setTooltipPosition] = useState({});
	const linkRef = useRef(null);
	// const tooltipRef = useRef(null);
	// const [tooltipTimeout, setTooltipTimeout] = useState(null);

	// const handleMouseEnter = () => {
	// 	if (tooltipTimeout) {
	// 		clearTimeout(tooltipTimeout);
	// 	}
	// 	const timeout = setTimeout(() => {
	// 		setIsTooltipVisible(true);
	// 	}, 500);
	// 	setTooltipTimeout(timeout);
	// };

	// const handleMouseLeave = () => {
	// 	setIsTooltipVisible(false);
	// 	if (tooltipTimeout) {
	// 		clearTimeout(tooltipTimeout);
	// 	}
	// };

	// useEffect(() => {
	// 	if (isTooltipVisible) {
	// 		const frame = requestAnimationFrame(() => {
	// 			if (!tooltipRef.current || !linkRef.current) return;

	// 			const linkRect = linkRef.current.getBoundingClientRect();
	// 			const tooltipRect = tooltipRef.current.getBoundingClientRect();

	// 			const windowWidth = window.innerWidth;
	// 			const windowHeight = window.innerHeight;

	// 			let top = linkRect.bottom + 8;
	// 			let left = linkRect.right - 6 * tooltipRect.height;

	// 			if (top + tooltipRect.height > windowHeight) {
	// 				top = linkRect.top - tooltipRect.height - 8;
	// 			}
	// 			if (left + tooltipRect.width > windowWidth) {
	// 				left = windowWidth - tooltipRect.width - 8;
	// 			}
	// 			if (left < 0) {
	// 				left = 8;
	// 			}

	// 			setTooltipPosition({
	// 				top: top + window.scrollY,
	// 				left: left + window.scrollX
	// 			});
	// 		});

	// 		return () => cancelAnimationFrame(frame);
	// 	}
	// }, [isTooltipVisible]);
	return (
		<div
			ref={drag}
			className={`bg-white hover:bg-gray-100 border border-[#ddd] rounded px-1.5 py-1.5 ${
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
						data-tooltip-place="bottom">
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

export default DraggableCourseItem;
