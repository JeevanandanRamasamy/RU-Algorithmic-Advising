import { useAuth } from "../context/AuthContext";
import { useCourses } from "../context/CoursesContext";
import { useTakenCourses } from "../context/TakenCoursesContext";
import { useStudentDetails } from "../context/StudentDetailsContext";
import { usePrograms } from "../context/ProgramsContext";
import { useCourseRequirements } from "../context/CourseRequirementContext";
import { useCourseRecords } from "../context/CourseRecordsContext";

import { useState, useEffect } from "react";
import CourseListContainer from "../components/courses/CourseListContainer";
import Button from "../components/generic/Button";
import TakenCourses from "../components/courses/TakenCourses";
import Navbar from "../components/navbar/Navbar";
import NotificationsButton from "../components/widgets/notifications";
import StudentDetails from "../components/studentInfo/studentDetails";
import StudentPrograms from "../components/studentInfo/studentPrograms";
import AvailableCourses from "../components/courses/AvailableCourses";
import { useNavigate } from "react-router-dom";

const Questionnaire = () => {
	const { user, token, role } = useAuth();
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
	} = useTakenCourses(fetchPlannedCoursesWithMissingRequirements);

	const [showAvailableCourseFilters, setShowAvailableCourseFilters] = useState(false);
	const [showTakenCourseFilters, setShowTakenCourseFilters] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
		if (role === "admin") {
			navigate("/admin/home"); // Redirect to admin dashboard if user is admin
		}
	}, [user, role, navigate]); // Runs whenever user changes

	return (
		<>
			<div className="p-5 ml-[130px] mr-auto h-auto overflow-x-hidden">
				<header className="flex justify-between items-center py-4 mb-8 border-b border-gray-300">
					<h1>Questionnaire</h1>
				</header>
				<Navbar />
				<NotificationsButton />
				<div className="">
					<div className="flex justify-between pb-5">
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
					<div className="flex gap-[30px]">
						<CourseListContainer
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
							CourseComponent={AvailableCourses}
							requirementStrings={requirementStrings}
						/>
						<CourseListContainer
							title="Taken Courses"
							courses={takenCourses}
							CourseComponent={TakenCourses}
							courseComponentProps={{
								loading: takenCoursesLoading,
								error: takenCoursesError,
								onRemoveCourse: handleRemoveTakenCourse,
								onAddCourse: handleAddTakenCourse
							}}
							requirementStrings={requirementStrings}
							hasCredits={true}
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
