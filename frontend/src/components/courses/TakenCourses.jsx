import React from "react";
import { useDrop } from "react-dnd";
import TakenCourseItem from "./TakenCourseItem";
import CourseList from "./CourseList";

const TakenCourses = ({
	courses,
	getCourse,
	loading,
	error,
	onRemoveCourse,
	onAddCourse,
	height = "200px"
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
		<div
			ref={drop}
			className={`flex-1 ${
				isOver ? "drag-over" : ""
			} rounded-lg shadow-md p-5 flex flex-col`}>
			<div
				className={`bg-white flex-1 border border-gray-200 overflow-y-scroll rounded-md p-2.5`}>
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
