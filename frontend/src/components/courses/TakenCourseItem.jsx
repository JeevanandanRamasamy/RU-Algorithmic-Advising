import React from "react";

import Button from "../generic/Button";

const TakenCourseItem = ({ course, onRemove }) => {
	return (
		<div className="bg-white border border-gray-300 rounded-md p-3 mb-2 transition-all duration-200 ease-in-out group">
			{/* <h3 className="font-semibold text-gray-800">{course.course_name}</h3>
			<p className="font-bold text-gray-700">ID: {course.course_id}</p>
			<p className="text-sm text-gray-600">{course.credits} credits</p> */}

			{/* <div className="flex justify-between items-center"> */}
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
		// </div>
	);
};

export default TakenCourseItem;
