// import React, { useState, useEffect, useCallback } from "react";
// import "../css/DragDrop.css";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

export const HorizontalAvailableCourses = ({ courses, getCourse, showFilters, limit }) => {
	return (
		<div className={`p-2`}>
			<div
				className={`non-draggable border border-gray-200 rounded-md flex m-0
						 flex-row overflow-y-hidden overflow-x-auto h-[200px] mx-2
						${showFilters ? "h-[600px]" : "h-[726.4px]"} gap-3`}>
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

export default HorizontalAvailableCourses;
