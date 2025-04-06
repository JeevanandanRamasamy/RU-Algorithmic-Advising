// import React, { useState, useEffect, useCallback } from "react";
// import "../css/DragDrop.css";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

export const AvailableCourses = ({
	courses,
	getCourse,
	isHorizontal = true,
	showFilters,
	limit
}) => {
	return (
		<div className={`p-2`}>
			<div
				className={`non-draggable border border-gray-200 rounded-md flex m-0 ${
					isHorizontal
						? "flex-row overflow-y-hidden overflow-x-auto h-[200px] mx-2"
						: `flex-col overflow-x-hidden overflow-y-auto px-2 ${
								showFilters ? "h-[600px]" : "h-[726.4px]"
						  }`
				} gap-3`}>
				<CourseList
					courses={courses}
					getCourse={getCourse}
					CourseItemComponent={CourseItem}
					limit={limit}
				/>
			</div>
		</div>
	);
};

export default AvailableCourses;
