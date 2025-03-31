import { useState, useEffect, useCallback, useRef } from "react";
import useCourses from "../hooks/useCourses";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import AvailableCourses from "../components/courses/AvailableCourses";
import CourseListContainer from "../components/courses/CourseListContainer";
import usePlannedCourses from "../hooks/usePlannedCourses";
import SemesterPlanner from "../components/semesterPlanner";
import DraggableCourseList from "../components/draggableCourseList";

function DragDrop() {
	const { courses, searchAvailable, setSearchAvailable } = useCourses();
	const {
		plannedCourses,
		plannedCoursesLoading,
		plannedCoursesError,
		fetchPlannedCourses,
		setPlannedCourses,
		searchPlannedQuery,
		setSearchPlannedQuery,
		handleAddPlannedCourse,
		handleRemovePlannedCourse
	} = usePlannedCourses();
	return (
		<>
			<div className="fixed">
				<DraggableCourseList
					title="Available Courses"
					searchQuery={searchAvailable}
					setSearchQuery={setSearchAvailable}
					courses={courses}
					excludedCourseIds={
						plannedCourses?.length > 0
							? plannedCourses.map(
									plannedCourse => plannedCourse.course_info.course_id
							  )
							: []
					}
					CourseComponent={AvailableCourses}
				/>
			</div>
			<div className="app h-auto overflow-x-hidden">
				<Navbar />

				<header className="app-header">
					<h1>Course Planner</h1>
				</header>
				<main className="gap-8 flex flex-col">
					{/* <CourseListContainer
					title="Available Courses"
					searchQuery={searchAvailable}
					setSearchQuery={setSearchAvailable}
					courses={courses}
					excludedCourseIds={
						plannedCourses?.length > 0
							? plannedCourses.map(
									plannedCourse => plannedCourse.course_info.course_id
							  )
							: []
					}
					CourseComponent={AvailableCourses}
					/> */}
					<SemesterPlanner
						{...{ plannedCourses, handleAddPlannedCourse, handleRemovePlannedCourse }}
					/>
					{/* <DropCoursesContainer
					term="fall"
					year={2022}
					courses={plannedCourses}
					getCourse={course => course.course_info}
					handleAddPlannedCourse={handleAddPlannedCourse}
					handleRemovePlannedCourse={handleRemovePlannedCourse}
				/>
				<DropCoursesContainer
					term="spring"
					year={2023}
					courses={plannedCourses}
					getCourse={course => course.course_info}
					handleAddPlannedCourse={handleAddPlannedCourse}
					handleRemovePlannedCourse={handleRemovePlannedCourse}
					/> */}
					{/* <DropCoursesContainer
					term="Fall"
					year={1995}
				/>
				<DropCoursesContainer
					term="Spring"
					year={1995}
				/>
				<DropCoursesContainer
					term="Fall"
					year={1995}
				/>
				<DropCoursesContainer
					term="Spring"
					year={1995}
				/>
				<DropCoursesContainer
					term="Fall"
					year={1995}
						/> */}
					{/* <CourseListContainer
					title="Planned Courses"
					searchQuery={searchPlannedQuery}
					setSearchQuery={setSearchPlannedQuery}
					courses={plannedCourses}
					getCourse={course => course.course_info}
					CourseComponent={PlannedCourses}
					courseComponentProps={{
						loading: plannedCoursesLoading,
						error: plannedCoursesError,
						onRemoveCourse: handleRemovePlannedCourse,
						onAddCourse: handleAddPlannedCourse
					}}
		/> */}
				</main>
			</div>
		</>
	);
}

export default DragDrop;
