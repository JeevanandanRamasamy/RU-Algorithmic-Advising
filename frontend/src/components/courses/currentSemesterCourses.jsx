import React from "react";
import { useDrop } from "react-dnd";
import CourseList from "./CourseList";
import PlannedCourseItem from "./PlannedCourseItem";

/**
 * Component for displaying the current semester's courses.
 * It handles adding courses to the current semester by dragging and dropping.
 * When a course is dropped, it triggers `onAddCourse` callback.
 */
const currentSemesterCourses = ({
	loading,
	courses,
	getCourse,
	onRemoveCourse,
	onAddCourse,
	showFilters,
	requirementStrings,
	coursesWithMissingRequirements
}) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			onAddCourse(item.id);
		},
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	}));
	return (
		<div
			ref={drop}
			className={`bg-white h-[90%] border border-gray-200 overflow-y-scroll rounded-md p-2.5 ${
				isOver ? "drag-over" : ""
			}`}>
			{loading ? (
				<div>Loading current courses...</div>
			) : (
				<CourseList
					courses={courses}
					getCourse={getCourse}
					CourseItemComponent={PlannedCourseItem}
					requirementStrings={requirementStrings}
					courseItemProps={{
						onRemove: onRemoveCourse,
						coursesWithMissingRequirements: coursesWithMissingRequirements
					}}
				/>
			)}
		</div>
	);
};

export default currentSemesterCourses;
