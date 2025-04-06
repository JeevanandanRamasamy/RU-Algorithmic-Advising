import { useState } from "react";
import CourseListContainer from "../components/courses/CourseListContainer";
import Button from "../components/generic/Button";
import TakenCourses from "../components/courses/TakenCourses";
import AvailableCourses from "../components/courses/AvailableCourses";
import { useAuth } from "../context/AuthContext";
import useCourses from "../hooks/useCourses";
import useTakenCourses from "../hooks/useTakenCourses";
import Navbar from "../components/navbar/Navbar";
import useStudentDetails from "../hooks/useStudentDetails";
import StudentDetails from "../components/studentInfo/studentDetails";
import usePrograms from "../hooks/usePrograms";
import StudentPrograms from "../components/studentInfo/studentPrograms";
import DropCoursesContainer from "../components/dropCoursesContainer";
import useCourseRecords from "../hooks/useCourseRecords";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Questionnaire = () => {
	const { user, token } = useAuth();
	const {
		classes,
		gradYear,
		setGradYear,
		enrollYear,
		setEnrollYear,
		gpa,
		setGpa,
		saveStudentDetails,
		handleGpaChange,
		handleGradYearChange,
		handleEnrollYearChange
	} = useStudentDetails();

	const {
		selectedProgramsQuery,
		setSelectedProgramsQuery,
		programsQuery,
		setProgramsQuery,
		programs,
		setPrograms,
		filteredPrograms,
		setFilteredPrograms,
		filteredSelectedPrograms,
		setFilteredSelectedPrograms,
		handleInsertProgram,
		handleRemoveProgram
	} = usePrograms();
	const { courses } = useCourses();
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

	const [showAvailableCourseFilters, setShowAvailableCourseFilters] = useState(false);
	const [showTakenCourseFilters, setShowTakenCourseFilters] = useState(false);
	return (
		<>
			<div className="overflow-x-hidden">
				<Navbar />
				<div className="ml-[110px] pt-[5px]">
					<div className="flex px-[10px] justify-evenly">
						<StudentDetails
							{...{
								enrollYear,
								handleEnrollYearChange,
								gradYear,
								handleGradYearChange,
								classes,
								gpa,
								handleGpaChange
							}}
						/>
						<StudentPrograms
							{...{
								programsQuery,
								setProgramsQuery,
								filteredPrograms,
								selectedProgramsQuery,
								setSelectedProgramsQuery,
								filteredSelectedPrograms,
								handleInsertProgram,
								handleRemoveProgram
							}}
						/>
					</div>
					<div className="flex gap-[30px] w-full">
						<CourseListContainer
							title="Available Courses"
							className="w-[600px]"
							courses={courses}
							excludedCourseIds={
								takenCourses?.length > 0
									? takenCourses.map(
											takenCourse => takenCourse.course_info.course_id
									  )
									: []
							}
							CourseComponent={AvailableCourses}
							showFilters={showAvailableCourseFilters}
							setShowFilters={setShowAvailableCourseFilters}
							courseComponentProps={{
								isHorizontal: false
							}}
						/>
						<CourseListContainer
							title="Taken Courses"
							// searchQuery={searchTaken}
							// setSearchQuery={setSearchTaken}
							courses={takenCourses}
							getCourse={course => course.course_info}
							CourseComponent={TakenCourses}
							courseComponentProps={{
								loading: takenCoursesLoading,
								error: takenCoursesError,
								onRemoveCourse: handleRemoveTakenCourse,
								onAddCourse: handleAddTakenCourse,
								isHorizontal: false
							}}
							showFilters={showTakenCourseFilters}
							setShowFilters={setShowTakenCourseFilters}
							isHorizontal={false}
						/>
					</div>
					<div className="flex justify-center mt-5">
						<Button
							className="bg-blue-500 text-white p-1 rounded w-20"
							label="Save"
							onClick={saveStudentDetails}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Questionnaire;
