import React, { useState, useRef, useEffect } from "react";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Button from "../generic/Button";

const TakenCourseItem = ({ course, onRemove, requirementString }) => {
	return (
		<div
			className={`bg-white border border-[#ddd] rounded px-1.5 py-1.5 group group-delete-${course.course_id}`}>
			<h3 className="text-base planned-course-name m-0">
				<a
					className="no-underline text-black hover:text-blue-500"
					href={course.course_link}
					target="_blank"
					rel="noopener noreferrer p-1">
					{course.course_name}
				</a>
			</h3>
			<p className="font-bold text-[#2c3e50] m-0 p-1">ID: {course.course_id}</p>

			{requirementString && (
				<>
					<a
						data-tooltip-id={`tooltip-${course.course_id}`}
						className="cursor-pointer text-blue-500 underline"
						data-tooltip-place="left">
						requirements
					</a>
					<Tooltip
						id={`tooltip-${course.course_id}`}
						className="bg-black">
						<pre className="text-sm z-10000">{requirementString}</pre>
					</Tooltip>
				</>
			)}
			<div className="flex justify-between">
				<p className="planned-course-credits m-0 text-center">{course.credits} credits</p>
				<Button
					className="bg-blue-500 text-white border-none px-2.5 py-1 rounded cursor-pointer invisible group-hover:visible transition-opacity duration-200 hover:bg-blue-700"
					onClick={() => onRemove(course.course_id)}
					label="-"
				/>
			</div>
		</div>
		// </div>
	);
};

export default TakenCourseItem;
