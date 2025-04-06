import { useState, useEffect, useCallback, useRef } from "react";
import useCourses from "../hooks/useCourses";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import AvailableCourses from "../components/courses/AvailableCourses";
import CourseListContainer from "../components/courses/CourseListContainer";
import SemesterPlanner from "../components/semesterPlanner";
import DraggableCourseList from "../components/draggableCourseList";
import Button from "../components/generic/Button";
import useCourseRecords from "../hooks/useCourseRecords";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";

function DragDrop() {
	const { user, token } = useAuth();
	const { courses } = useCourses();
	// const {
	// 	plannedCourses,
	// 	plannedCoursesLoading,
	// 	plannedCoursesError,
	// 	fetchPlannedCourses,
	// 	setPlannedCourses,
	// 	searchPlannedQuery,
	// 	setSearchPlannedQuery,
	// 	handleAddPlannedCourse,
	// 	handleRemovePlannedCourse
	// } = usePlannedCourses();
	const {
		courseRecords,
		setCourseRecords,
		coursesRecordsLoading,
		setCoursesRecordsLoading,
		coursesRecordsError,
		setCourseRecordsError,
		handleAddCourseRecord,
		handleRemoveCourseRecord
	} = useCourseRecords();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* <div className="fixed"> */}
			<DraggableCourseList
				title="Available Courses"
				courses={courses}
				excludedCourseIds={
					courseRecords?.length > 0
						? courseRecords.map(course => course?.course_info.course_id)
						: []
				}
				CourseComponent={AvailableCourses}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
			{/* </div> */}
			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<header className="app-header">
					<h1>Course Planner</h1>
				</header>
				<div className="pb-2 flex justify-end">
					<Button
						onClick={() => setIsOpen(!isOpen)}
						className="p-2 flex items-center justify-center rounded bg-blue-500 text-white  border border-black"
						label={isOpen ? "Close Available Courses" : "Open Available Courses"}
					/>
				</div>
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
						{...{ courseRecords, handleAddCourseRecord, handleRemoveCourseRecord }}
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
