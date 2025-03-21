import React from "react";

import Button from "../generic/Button";

const TakenCourseItem = ({ course, onRemove }) => {
	return (
		<div className="bg-white border border-gray-300 rounded-md p-3 mb-2 cursor-grab transition-all duration-200 ease-in-out group">
			<h3 className="font-semibold text-gray-800">{course.course_name}</h3>
			<p className="font-bold text-gray-700">ID: {course.course_id}</p>
			<p className="text-sm text-gray-600">{course.credits} credits</p>

			<div className="flex justify-between items-center">
				<a
					className="text-blue-500 hover:underline"
					href={course.course_link}
					target="_blank"
					rel="noopener noreferrer">
					Course Details
				</a>
				<Button
					onClick={() => onRemove(course.course_id)}
					className="bg-[#f44336] text-white border-none px-2.5 py-1 rounded cursor-pointer invisible group-hover:visible transition-opacity duration-200 hover:bg-[#d32f2f]"
					label="Remove"
				/>
			</div>
		</div>
	);
};

export default TakenCourseItem;
