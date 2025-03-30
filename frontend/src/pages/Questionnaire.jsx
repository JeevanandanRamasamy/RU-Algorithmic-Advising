import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseListContainer from "../components/courses/CourseListContainer";
import Button from "../components/generic/Button";
import TakenCourses from "../components/courses/TakenCourses";
import Dropdown from "../components/generic/Dropdown";
import AvailableCourses from "../components/courses/AvailableCourses";
import { useAuth } from "../context/AuthContext";
import useCourses from "../hooks/useCourses";
import useTakenCourses from "../hooks/useTakenCourses";
import ListContainer from "../components/generic/ListContainer";
import Navbar from "../components/navbar/Navbar";
import useStudentDetails from "../hooks/useStudentDetails";
import StudentDetails from "../components/studentInfo/studentDetails";
import usePrograms from "../hooks/usePrograms";
import StudentPrograms from "../components/studentInfo/studentPrograms";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Questionnaire = () => {
	const { user, token } = useAuth();
	// const [gradYear, setGradYear] = useState("");
	// const [enrolledYear, setEnrolledYear] = useState("");
	// const [programsQuery, setProgramsQuery] = useState("");
	// const [selectedProgramsQuery, setSelectedProgramsQuery] = useState("");
	// const [gpa, setGpa] = useState(0);
	// const [classYear, setClassYear] = useState("");
	// const [programs, setPrograms] = useState([]);
	// const [selectedPrograms, setSelectedPrograms] = useState([]);
	// const [filteredPrograms, setFilteredPrograms] = useState([]);
	// const [filteredSelectedPrograms, setFilteredSelectedPrograms] = useState([]);
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
	const {
		takenCourses,
		takenCoursesLoading,
		takenCoursesError,
		fetchTakenCourses,
		setTakenCourses,
		handleRemoveTakenCourse,
		handleAddTakenCourse,
		searchTaken,
		setSearchTaken
	} = useTakenCourses(backendUrl, token, setCourses);

	// useEffect(() => {
	// 	const fetchPrograms = async () => {
	// 		try {
	// 			const response = await fetch(`${backendUrl}/api/programs`);
	// 			const data = await response.json();
	// 			setFilteredPrograms(data.programs);
	// 			setPrograms(data.programs);
	// 		} catch (error) {
	// 			console.error("Error fetching programs:", error);
	// 		}
	// 	};

	// 	const fetchUserPrograms = async () => {
	// 		try {
	// 			if (!user) return;
	// 			const response = await fetch(`${backendUrl}/api/users/programs`, {
	// 				method: "GET",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 					"Authorization": `Bearer ${localStorage.getItem("token")}`
	// 				}
	// 			});
	// 			const data = await response.json();
	// 			setSelectedPrograms(data.student_program);
	// 		} catch (error) {
	// 			console.error("Error fetching programs:", error);
	// 		}
	// 	};
	// const fetchUserDetails = async () => {
	// 	try {
	// 		if (!user) return;
	// 		const response = await fetch(`${backendUrl}/api/users/details`, {
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				"Authorization": `Bearer ${localStorage.getItem("token")}`
	// 			}
	// 		});
	// 		const data = await response.json();
	// 		const fields = {
	// 			grad_date: setGradYear,
	// 			enroll_date: setEnrolledYear,
	// 			gpa: setGpa,
	// 			class_year: setClassYear
	// 		};
	// 		Object.entries(fields).forEach(([key, setter]) => {
	// 			if (data.user_details[key]) {
	// 				setter(data.user_details[key]);
	// 			}
	// 		});
	// 	} catch (error) {
	// 		console.error("Error fetching programs:", error);
	// 	}
	// };
	// 	fetchPrograms();
	// 	fetchUserPrograms();
	// 	// fetchUserDetails();
	// }, [user]);

	// useEffect(() => {
	// 	if (!programs) return;

	// 	const filteredPrograms = programsQuery
	// 		? programs.filter(program =>
	// 				program.program_name.toLowerCase().includes(programsQuery.toLowerCase())
	// 		  )
	// 		: programs;

	// 	setFilteredPrograms(filteredPrograms);
	// }, [programsQuery, programs]);

	// useEffect(() => {
	// 	if (!selectedPrograms) return;

	// 	const filteredSelectedPrograms = selectedProgramsQuery?.trim()
	// 		? selectedPrograms.filter(program =>
	// 				program.program_name.toLowerCase().includes(selectedProgramsQuery.toLowerCase())
	// 		  )
	// 		: selectedPrograms;

	// 	setFilteredSelectedPrograms(filteredSelectedPrograms);
	// }, [selectedProgramsQuery, selectedPrograms]);

	// const handleInsertProgram = async program_id => {
	// 	const response = await fetch(`${backendUrl}/api/users/programs`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"Authorization": `Bearer ${localStorage.getItem("token")}`
	// 		},

	// 		body: JSON.stringify({
	// 			username: user,
	// 			program_id: program_id
	// 		})
	// 	});
	// 	const data = await response.json();
	// 	if (response.ok) {
	// 		setSelectedPrograms(prev => [...prev, data.student_program]);
	// 	} else {
	// 		// console.log(data);
	// 	}
	// 	// TODO: handle errors
	// };

	// const handleRemoveProgram = async program_id => {
	// 	const response = await fetch(`${backendUrl}/api/users/programs`, {
	// 		method: "DELETE",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"Authorization": `Bearer ${localStorage.getItem("token")}`
	// 		},
	// 		body: JSON.stringify({ username: "admin", program_id: program_id })
	// 	});
	// 	const data = await response.json();
	// 	// console.log(data);
	// 	if (response.ok) {
	// 		setSelectedPrograms(
	// 			selectedPrograms.filter(p => p.program_id !== data.student_program.program_id)
	// 		);
	// 	}
	// 	// TODO: handle errors
	// };
	// const saveData = async () => {
	// 	const response = await fetch(`${backendUrl}/api/users/details`, {
	// 		method: "PUT",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"Authorization": `Bearer ${localStorage.getItem("token")}`
	// 		},
	// 		body: JSON.stringify(
	// 			Object.fromEntries(
	// 				Object.entries({
	// 					grad_date: gradYear,
	// 					enroll_date: enrolledYear,
	// 					gpa: gpa,
	// 					class_year: classYear
	// 				}).filter(([_, value]) => value !== "")
	// 			)
	// 		)
	// 	});
	// 	//TODO: redirect
	// 	if (response.ok) {
	// 		navigate("/home");
	// 	} else {
	// 	}
	// };

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
						<CourseListContainer
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
						/>
						<CourseListContainer
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
						/>
					</div>
					<div className="flex justify-center mt-5">
						<Button
							className="bg-blue-500 text-white p-1 rounded w-20"
							label="Save"
							onClick={saveStudentDetails}
						/>
					</div>
					{/* <div className="flex justify-center mt-5">
					<Button
						className="bg-blue-500 text-white p-1 rounded w-20"
						label="Save"
						onClick={saveData}
					/>
		</div> */}
				</div>
			</div>
		</>
	);
};

export default Questionnaire;
