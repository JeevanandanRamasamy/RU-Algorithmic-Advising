import React from "react";
import { useDrop } from "react-dnd";
import TakenCourseItem from "./TakenCourseItem";
import CourseList from "./CourseList";

const TakenCourses = ({ courses, getCourse, loading, error, onRemoveCourse, onAddCourse }) => {
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
			className={`flex-1 overflow-y-auto border border-gray-200 rounded-md p-2.5 ${
				isOver ? "drag-over" : ""
			}`}>
			{loading ? (
				<div>Loading taken courses...</div>
			) : error ? (
				<div className="bg-red-100 text-red-800 p-2.5 rounded-md mb-5 text-center">
					{error}
				</div>
			) : courses?.length > 0 ? (
				<div className="planned-courses-list">
					<CourseList
						courses={courses}
						getCourse={getCourse}
						CourseItemComponent={TakenCourseItem}
						courseItemProps={{ onRemove: onRemoveCourse }}
					/>
				</div>
			) : (
				<div className="no-courses-message">
					No courses planned. Drag and drop to add courses.
				</div>
			)}
		</div>
	);
};

export default TakenCourses;
