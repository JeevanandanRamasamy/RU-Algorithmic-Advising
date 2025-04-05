// import React, { useState, useEffect, useCallback } from "react";
// import "../css/DragDrop.css";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

export const AvailableCourses = ({ courses, getCourse, limit }) => {
	return (
		<div className="p-2">
			<div
				className={`non-draggable border border-gray-200 rounded-md flex flex-row gap-3 overflow-x-auto overflow-y-hidden h-[200px] p-2`}>
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
