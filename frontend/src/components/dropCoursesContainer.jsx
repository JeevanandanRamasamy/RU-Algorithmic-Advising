import React from "react";
import useSemester from "../hooks/useSemester";
import { useDrop } from "react-dnd";
import CourseList from "./courses/CourseList";
import CourseItem from "./courses/CourseItem";
import PlannedCourseItem from "./courses/PlannedCourseItem";

const DropCoursesContainer = ({
	loading,
	term,
	year,
	courses,
	getCourse,
	handleAddPlannedCourse,
	handleRemovePlannedCourse
}) => {
	// const { year, setYear, term, setTerm } = useSemester(year, term);
	const coursesBySemester = courses?.filter(
		course => course?.term === term && course?.year === year
	);
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			console.log("Added course:", item, term, year);
			handleAddPlannedCourse(item.id, term, year);
		},
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	}));
	return (
		<div className="bg-white rounded-lg shadow-md p-5 h-[600px] flex flex-col">
			<div>
				{term?.toUpperCase()} {year}
			</div>
			<div
				ref={drop}
				className={`h-full flex-1 overflow-y-auto border border-gray-200 rounded-md p-2.5 ${
					isOver ? "drag-over" : ""
				}`}>
				{loading ? (
					<div>Loading taken courses...</div>
				) : (
					<CourseList
						courses={coursesBySemester}
						getCourse={getCourse}
						CourseItemComponent={PlannedCourseItem}
						courseItemProps={{ onRemove: handleRemovePlannedCourse }}
					/>
				)}
			</div>
		</div>
	);
};

export default DropCoursesContainer;
