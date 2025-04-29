import React from "react";
import { useDrop } from "react-dnd";
import TakenCourseItem from "./TakenCourseItem";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

const TakenCourses = ({
	courses,
	getCourse,
	onRemoveCourse,
	onAddCourse,
	showFilters,
	requirementStrings
}) => {
	const [{ isOver, canDrop }, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			// console.log("Added course:", item);
			onAddCourse(item.id);
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			canDrop: monitor.canDrop()
		})
	}));

	const isActive = isOver && canDrop; // Just used something similar from toRequest.jsx

	return (
		<div
			ref={drop}
			className={`p-2 overflow-y-scroll border rounded-md transition-all ${
				isActive ? "border-green-500 bg-green-100" : "border-gray-200 bg-white"
			} ${showFilters ? "h-[600px]" : "h-[726.4px]"}`}
			>
			<CourseList
				courses={courses}
				getCourse={getCourse}
				CourseItemComponent={TakenCourseItem}
				requirementStrings={requirementStrings}
				courseItemProps={{ onRemove: onRemoveCourse }}
			/>
		</div>
	);
};

export default TakenCourses;
