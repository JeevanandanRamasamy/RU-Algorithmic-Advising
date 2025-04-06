// import React, { useState, useEffect, useCallback } from "react";
// import "../css/DragDrop.css";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

export const AvailableCourses = ({ courses, getCourse, isHorizontal = true, limit, height }) => {
	return (
		<div className={`p-2 max-h-[500px]`}>
			<div
				className={`non-draggable border border-gray-200 rounded-md flex ${
					isHorizontal
						? "flex-row overflow-y-hidden overflow-x-auto"
						: "flex-col overflow-x-hidden overflow-y-auto"
				} gap-3 p-2`}>
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
