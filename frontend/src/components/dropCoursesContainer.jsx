import React from "react";
import useSemester from "../hooks/useSemester";
import { useDrop } from "react-dnd";
import CourseList from "./courses/CourseList";
import CourseItem from "./courses/CourseItem";
import PlannedCourseItem from "./courses/PlannedCourseItem";
import { containsSemester } from "../helpers/semesters";

const DropCoursesContainer = ({
	loading,
	term,
	year,
	courseRecords,
	getCourse,
	handleAddPlannedCourse,
	handleRemovePlannedCourse,
	semestersTillNow = { semestersTillNow }
}) => {
	const coursesBySemester = courseRecords?.filter(
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
		<div
			className={`flex-1
		${containsSemester(semestersTillNow, year, term) ? "bg-green-600" : "bg-blue-700"}
		 rounded-lg shadow-md p-5 h-[400px] flex flex-col `}>
			<div className="text-center h-[10%] text-white">
				{term?.toUpperCase()} {year}
			</div>
			<div
				ref={drop}
				className={`bg-white h-[90%] border border-gray-200 overflow-y-scroll rounded-md p-2.5 ${
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
