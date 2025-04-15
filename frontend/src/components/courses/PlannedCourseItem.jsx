import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import Button from "../generic/Button";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const PlannedCourseItem = ({
	course,
	onRemove,
	requirementString,
	coursesWithMissingRequirements
}) => {
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
	const courseInfo = coursesWithMissingRequirements?.[String(course.course_id)];
	const updatedRequirementString = courseInfo?.requirement_string ?? requirementString;
	const isRed = courseInfo && courseInfo?.requirements_fulfilled === false;
	return (
		<div
			ref={drag}
			className={`border border-gray-300 rounded p-1.5 cursor-grab transition-all duration-200 ease-linear ${
				isRed ? "bg-red-400" : "bg-white"
			} ${isDragging ? "dragging" : ""} planned group`}>
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
				<Button
					className="bg-blue-500 text-white border-none px-2.5 py-1 rounded cursor-pointer invisible group-hover:visible transition-opacity duration-200 hover:bg-blue-700"
					onClick={() => onRemove(course.course_id)}
					label="Remove"
				/>
			</div>

			{requirementString && (
				<>
					<a
						data-tooltip-id={`tooltip-${course.course_id}`}
						className="cursor-pointer text-blue-600 underline"
						data-tooltip-place="bottom">
						requirements
					</a>
					<Tooltip
						id={`tooltip-${course.course_id}`}
						className="bg-black">
						<pre
							className="text-sm z-10000"
							dangerouslySetInnerHTML={{
								__html: updatedRequirementString
							}}
						/>
					</Tooltip>
				</>
			)}
		</div>
	);
};

export default PlannedCourseItem;
