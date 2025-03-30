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

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Questionnaire = () => {
	const { user, token } = useAuth();
	const {
		classes,
		gradYear,
		setGradYear,
		enrolledYear,
		setEnrolledYear,
		gpa,
		setGpa,
		classYear,
		setClassYear,
		saveStudentDetails,
		handleGpaChange,
		handleGradYearChange,
		handleEnrolledYearChange
	} = useStudentDetails(backendUrl, user, token);

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
	} = usePrograms(backendUrl, user, token);

	const {
		courses,
		coursesLoading,
		coursesError,
		fetchCourses,
		setCourses,
		searchAvailable,
		setSearchAvailable,
		filteredCourses,
		setFilteredCourses
	} = useCourses(backendUrl, token);
	// const {
	// 	takenCourses,
	// 	takenCoursesLoading,
	// 	takenCoursesError,
	// 	fetchTakenCourses,
	// 	setTakenCourses,
	// 	handleRemoveTakenCourse,
	// 	handleAddTakenCourse,
	// 	searchTaken,
	// 	setSearchTaken
	// } = useTakenCourses(backendUrl, token, setCourses);

	return (
		<>
			<div className="">
				<Navbar />
				<div className="ml-[110px] pt-[5px]">
					<div className="flex px-[10px] justify-evenly">
						<StudentDetails
							{...{
								enrolledYear,
								handleEnrolledYearChange,
								gradYear,
								handleGradYearChange,
								classes,
								classYear,
								setClassYear,
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
						{/* <CourseListContainer
							title="Available Courses"
							searchQuery={searchAvailable}
							setSearchQuery={setSearchAvailable}
							courses={courses}
							excludedCourseIds={
								takenCourses?.length > 0
									? takenCourses.map(
											takenCourse => takenCourse.course_info.course_id
									  )
									: []
							}
							CourseComponent={AvailableCourses}
						/> */}
						{/* <CourseListContainer
							title="Taken Courses"
							searchQuery={searchTaken}
							setSearchQuery={setSearchTaken}
							courses={takenCourses}
							getCourse={course => course.course_info}
							CourseComponent={TakenCourses}
							courseComponentProps={{
								loading: takenCoursesLoading,
								error: takenCoursesError,
								onRemoveCourse: handleRemoveTakenCourse,
								onAddCourse: handleAddTakenCourse
							}}
						/> */}
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
