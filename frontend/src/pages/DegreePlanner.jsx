import { useState, useEffect, useCallback, useRef } from "react";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import SemesterPlanner from "../components/courses/semesterPlanner";
import DraggableCourseList from "../components/courses/draggableCourseList";
import Button from "../components/generic/Button";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import HorizontalAvailableCourses from "../components/courses/HorizontalAvailableCourses";

import { useTakenCourses } from "../context/TakenCoursesContext";
import { useCourses } from "../context/CoursesContext";
import { useCourseRequirements } from "../context/CourseRequirementContext";
import { useCourseRecords } from "../context/CourseRecordsContext";

function DragDrop() {
	const { user, token } = useAuth();
	const { courses } = useCourses();

	const {
		coursesWithMissingRequirements,
		fetchPlannedCoursesWithMissingRequirements,
		requirementStrings
	} = useCourseRequirements();
	const {
		courseRecords,
		setCourseRecords,
		coursesRecordsLoading,
		setCoursesRecordsLoading,
		coursesRecordsError,
		setCourseRecordsError,
		handleAddCourseRecord,
		handleRemoveCourseRecord
	} = useCourseRecords(fetchPlannedCoursesWithMissingRequirements);

	const {
		takenCourses,
		takenCoursesLoading,
		takenCoursesError,
		fetchTakenCourses,
		setTakenCourses,
		handleAddTakenCourse,
		handleRemoveTakenCourse,
		searchTaken,
		setSearchTaken
	} = useTakenCourses();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<DraggableCourseList
				title="Available Courses"
				courses={courses}
				excludedCourseIds={[
					...(courseRecords?.length > 0
						? courseRecords.map(course => course?.course_info.course_id)
						: []),
					...(takenCourses?.length > 0
						? takenCourses.map(takenCourse => takenCourse.course_id)
						: [])
				]}
				CourseComponent={HorizontalAvailableCourses}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				requirementStrings={requirementStrings}
			/>
			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<header className="flex justify-between items-center py-4 mb-8 border-b border-gray-300">
					<h1>Degree Planner</h1>
				</header>
				<div className="pb-2 flex justify-end gap-2">
					<Button
						onClick={() => setIsOpen(!isOpen)}
						className="p-2 flex items-center justify-center rounded bg-blue-500 text-white  border border-black"
						label={isOpen ? "Close Available Courses" : "Open Available Courses"}
					/>
				</div>
				<main className="gap-8 flex flex-col">
					<SemesterPlanner
						{...{
							courses,
							courseRecords,
							handleAddCourseRecord,
							handleRemoveCourseRecord,
							takenCourses,
							requirementStrings,
							coursesWithMissingRequirements
						}}
					/>
				</main>
			</div>
		</>
	);
}

export default DragDrop;
