import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useEffect } from "react";
import Button from "../components/Button";
import ListContainer from "../components/ListContainer";
import { useAuth } from "../context/AuthContext";
import AvailableCourses from "../components/AvailableCourses";
import useCourses from "../hooks/useCourses";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Questionnaire = () => {
	const [gradYear, setGradYear] = useState("");
	const [enrolledYear, setEnrolledYear] = useState("");
	const [programsQuery, setProgramsQuery] = useState("");
	const [selectedProgramsQuery, setSelectedProgramsQuery] = useState("");
	const [gpa, setGpa] = useState(0);
	const [classYear, setClassYear] = useState("");
	const [programs, setPrograms] = useState([]);
	const [selectedPrograms, setSelectedPrograms] = useState([]);
	const [filteredPrograms, setFilteredPrograms] = useState([]);
	const [filteredSelectedPrograms, setFilteredSelectedPrograms] = useState([]);
	const classes = ["freshman", "sophomore", "junior", "senior", "graduate"];
	const { user, token } = useAuth();
	const { courses, coursesLoading, coursesError, fetchCourses, setCourses } = useCourses(
		backendUrl,
		token
	);
	const navigate = useNavigate();

	console.log(user);

	const handleGpaChange = e => {
		const value = e.target.value;
		if (value === "" || /^(4(\.0{0,2})?|0?\.?\d{0,2}|[1-3](\.\d{0,2})?)$/.test(value)) {
			setGpa(value);
		}
	};

	const handleGradYearChange = event => {
		const value = event.target.value;

		if (/^\d{0,4}$/.test(value)) {
			setGradYear(value);
		}
	};
	const handleEnrolledYearChange = event => {
		const value = event.target.value;

		if (/^\d{0,4}$/.test(value)) {
			setEnrolledYear(value);
		}
	};

	useEffect(() => {
		const fetchPrograms = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/programs`);
				const data = await response.json();
				setFilteredPrograms(data.programs);
				setPrograms(data.programs);
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};

		const fetchUserPrograms = async () => {
			try {
				if (!user) return;
				const response = await fetch(`${backendUrl}/api/users/programs`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				const data = await response.json();
				setSelectedPrograms(data.student_program);
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};
		const fetchUserDetails = async () => {
			try {
				if (!user) return;
				const response = await fetch(`${backendUrl}/api/users/details`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				const data = await response.json();
				console.log(data);
				const fields = {
					grad_date: setGradYear,
					enroll_date: setEnrolledYear,
					gpa: setGpa,
					class_year: setClassYear
				};
				Object.entries(fields).forEach(([key, setter]) => {
					if (data.user_details[key]) {
						setter(data.user_details[key]);
					}
				});
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};
		fetchPrograms();
		fetchUserPrograms();
		fetchUserDetails();
	}, [user]);

	useEffect(() => {
		if (!programs) return;

		const filteredPrograms = programsQuery
			? programs.filter(program =>
					program.program_name.toLowerCase().includes(programsQuery.toLowerCase())
			  )
			: programs;

		setFilteredPrograms(filteredPrograms);
	}, [programsQuery, programs]);

	useEffect(() => {
		if (!selectedPrograms) return;

		const filteredSelectedPrograms = selectedProgramsQuery?.trim()
			? selectedPrograms.filter(program =>
					program.program_name.toLowerCase().includes(selectedProgramsQuery.toLowerCase())
			  )
			: selectedPrograms;

		setFilteredSelectedPrograms(filteredSelectedPrograms);
	}, [selectedProgramsQuery, selectedPrograms]);

	const handleInsertProgram = async program_id => {
		const response = await fetch(`${backendUrl}/api/users/programs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			},

			body: JSON.stringify({
				username: user,
				program_id: program_id
			})
		});
		const data = await response.json();
		console.log(data);
		if (data.status === "success") {
			console.log(data);
			console.log(selectedPrograms);
			setSelectedPrograms(prev => [...prev, data.student_program]);
		} else {
			console.log(data);
		}
		// TODO: handle errors
	};

	const handleRemoveProgram = async program_id => {
		const response = await fetch(`${backendUrl}/api/users/programs`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			},
			body: JSON.stringify({ username: "admin", program_id: program_id })
		});
		const data = await response.json();
		console.log(data);
		if (data.status === "success") {
			setSelectedPrograms(
				selectedPrograms.filter(p => p.program_id !== data.student_program.program_id)
			);
		}
		// TODO: handle errors
	};
	const saveData = async () => {
		const response = await fetch(`${backendUrl}/api/users/details`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			},
			body: JSON.stringify(
				Object.fromEntries(
					Object.entries({
						grad_date: gradYear,
						enroll_date: enrolledYear,
						gpa: gpa,
						class_year: classYear
					}).filter(([_, value]) => value !== "")
				)
			)
		});

		const data = await response.json();
		console.log(response);
		//TODO: redirect
		if (data.status == "success") {
			navigate("/home");
		} else {
		}
	};

	// useEffect(() => {
	// 	fetchCourses();
	// }, [token]);

	return (
		<>
			<div className="flex gap-5">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row gap-5 items-center">
						<label
							className=""
							htmlFor="enrolled-year">
							Enrolled Year:
						</label>
						<input
							type="text"
							id="enrolled-year"
							value={enrolledYear}
							onChange={handleEnrolledYearChange}
							maxLength={4}
							placeholder="Enter Enrolled Year"
							className="border border-gray-300 p-2 rounded"
						/>
					</div>
					<div className="flex flex-row gap-5 items-center">
						<label
							className=""
							htmlFor="graduation-year">
							Graduation Year:
						</label>
						<input
							type="text"
							id="graduation-year"
							value={gradYear}
							onChange={handleGradYearChange}
							maxLength={4}
							placeholder="Enter year"
							className="border border-gray-300 p-2 rounded"
						/>
					</div>
					<div className="flex flex-row gap-5 items-center">
						<Dropdown
							options={classes}
							selectedValue={classYear}
							onChange={event => setClassYear(event.target.value)}
							placeholder="Select Class Year"
						/>
					</div>

					<div className="flex flex-row gap-5 items-center">
						<label
							className=""
							htmlFor="GPA">
							GPA:
						</label>
						<input
							type="number"
							max="4.0"
							min="0"
							step="0.01"
							id="gpa-input"
							value={gpa}
							onChange={handleGpaChange}
							placeholder="Enter GPA (0.00 - 4.00)"
							className="border border-gray-300 p-2 rounded"
						/>
					</div>
				</div>

				<div>
					<ListContainer
						query={programsQuery}
						handleQueryChange={event => setProgramsQuery(event.target.value)}
						values={filteredPrograms}
						searchText="Search Program By Name"
						type="Program"
						field="program_name"
						key_field="program_id"
						buttonType="add"
						handleButtonClick={handleInsertProgram}
					/>
					<ListContainer
						query={selectedProgramsQuery}
						handleQueryChange={event => setSelectedProgramsQuery(event.target.value)}
						searchText="Search Selected Programs"
						values={filteredSelectedPrograms}
						field="program_name"
						key_field="program_id"
						buttonType="remove"
						handleButtonClick={handleRemoveProgram}
					/>
				</div>
				<AvailableCourses courses={courses} />
			</div>
			<Button
				className="bg-blue-500 text-white p-1 rounded w-20"
				label="Save"
				onClick={saveData}
			/>
		</>
	);
};

export default Questionnaire;
