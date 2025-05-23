import React from "react";
import { useDrop } from "react-dnd";
import TakenCourseItem from "./TakenCourseItem";
import CourseList from "./CourseList";

/**
 * The `TakenCourses` component displays a list of courses that the user has taken.
 * It also allows new courses to be dropped into the container.
 * Provides the ability to remove courses from the list and show filter options.
 */
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

	const isActive = isOver && canDrop;

	return (
		<div
			ref={drop}
			className={`p-2 overflow-y-scroll border rounded-md transition-all ${
				isActive ? "border-green-500 bg-green-100" : "border-gray-200 bg-white"
			} ${showFilters ? "h-[600px]" : "h-[726.4px]"}`}>
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
