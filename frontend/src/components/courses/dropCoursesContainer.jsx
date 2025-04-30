import React from "react";
import useSemester from "../../hooks/useSemester";
import { useDrop } from "react-dnd";
import CourseList from "./CourseList";
import CourseItem from "./CourseItem";
import PlannedCourseItem from "./PlannedCourseItem";
import useSemesterInfo from "../../hooks/useSemesterInfo";

const DropCoursesContainer = ({
	loading,
	term,
	year,
	courseRecords,
	getCourse,
	handleAddPlannedCourse,
	handleRemovePlannedCourse,
	semestersTillNow = { semestersTillNow },
	requirementStrings,
	coursesWithMissingRequirements,
	hasCredits = false
}) => {
	const coursesBySemester = courseRecords?.filter(
		course => course?.term === term && course?.year === year
	);
	const { containsSemester } = useSemesterInfo();

	const [{ isOver, canDrop}, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			// console.log("Added course:", item, term, year);
			handleAddPlannedCourse(item.id, term, year);
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			canDrop: monitor.canDrop()
		})
	}));

	const isActive = isOver && canDrop;

	return (
		<div
			className={`flex-1
		${containsSemester(semestersTillNow, year, term) ? "bg-green-600" : "bg-blue-700"}
		 rounded-lg shadow-md p-5 h-[400px] flex flex-col `}>
			<div className="text-center h-[10%] text-white">
				{term?.toUpperCase()} {year}
				{hasCredits && (
					<>
						{" "}
						(
						{coursesBySemester
							.map(getCourse)
							.reduce((sum, course) => sum + parseInt(course?.credits || 0, 10), 0)}
						)
					</>
				)}
			</div>
			<div
				ref={drop}
				className={`h-[90%] border overflow-y-scroll rounded-md p-2.5 ${
					isActive ? "bg-green-100 border-green-400" : "bg-white border-gray-200"}`}>
				{loading ? (
					<div>Loading taken courses...</div>
				) : (
					<CourseList
						courses={coursesBySemester}
						getCourse={getCourse}
						CourseItemComponent={PlannedCourseItem}
						requirementStrings={requirementStrings}
						courseItemProps={{
							onRemove: handleRemovePlannedCourse,
							coursesWithMissingRequirements: coursesWithMissingRequirements
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default DropCoursesContainer;
