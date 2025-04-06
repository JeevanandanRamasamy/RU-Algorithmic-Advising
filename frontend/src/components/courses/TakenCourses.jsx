import React from "react";
import { useDrop } from "react-dnd";
import TakenCourseItem from "./TakenCourseItem";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

const TakenCourses = ({
	courses,
	getCourse,
	loading,
	error,
	onRemoveCourse,
	onAddCourse,
	showFilters,
	isHorizontal = false
}) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			// console.log("Added course:", item);
			onAddCourse(item.id);
		},
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	}));

	return (
		<div className="p-2">
			{/* <div
				ref={drop}
				className={`flex-1 ${
					isOver ? "drag-over" : ""
				} rounded-lg shadow-md p-2 flex flex-col h-[600px]`}> */}

			{/* <div
				className={`non-draggable border border-gray-200 rounded-md flex m-0 flex-col overflow-x-hidden overflow-y-auto px-2 ${
					showFilters ? "h-[600px]" : "h-[726.4px]"
				} gap-3`}> */}

			<div
				ref={drop}
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
					CourseItemComponent={TakenCourseItem}
					courseItemProps={{ onRemove: onRemoveCourse }}
				/>
			</div>
		</div>
	);
};

export default TakenCourses;
