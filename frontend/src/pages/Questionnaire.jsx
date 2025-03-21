import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useEffect } from "react";
import CourseTakenList from "../components/CourseTakenList";
import DropdownWithSearch from "../components/DropdownWithSearch";
import Button from "../components/Button";
import { majors, minors, subjects, certificate } from "../data/sas";
import ListContainer from "../components/ListContainer";
import Navbar from "../components/navbar/Navbar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Questionnaire = () => {
	const [gradYear, setGradYear] = useState("");
	const [enrolledYear, setEnrolledYear] = useState("");
	const [courseQuery, setCourseQuery] = useState("");
	const [programsQuery, setProgramsQuery] = useState("");
	const [selectedProgramsQuery, setSelectedProgramsQuery] = useState("");
	const [gpa, setGpa] = useState(0);
	const [classYear, setClassYear] = useState("");
	const [courses, setCourses] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [selectedPrograms, setSelectedPrograms] = useState([]);
	const [filteredPrograms, setFilteredPrograms] = useState([]);
	const [filteredCourses, setFilteredCourses] = useState([]);
	const [filteredSelectedPrograms, setFilteredSelectedPrograms] = useState([]);
	const classes = ["freshman", "sophomore", "junior", "senior", "graduate"];
	const navigate = useNavigate();

	const handleGpaChange = e => {
		const value = e.target.value;
		// Ensure the GPA is a valid number between 0 and 4.0
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

	// // TODO: get all schools/ data from backend
	// const schools = [
	// 	"School of Arts and Sciences",
	// 	"Mason Gross School of the Arts",
	// 	"Graduate Mason Gross School of the Arts",
	// 	"Edward J. Bloustein School of Planning and Public Policy: Undergraduate",
	// 	"School of Environmental and Biological Sciences",
	// 	"School of Engineering",
	// 	"Graduate School of Education",
	// 	"School of Graduate Studies–New Brunswick",
	// 	"School of Communication and Information",
	// 	"Graduate School of Applied and Professional Psychology",
	// 	"Graduate School of Social Work",
	// 	"Ernest Mario School of Pharmacy*",
	// 	"Graduate School of Pharmacy",
	// 	"School of Business",
	// 	"Edward J. Bloustein School of Planning and Public Policy: Graduate",
	// 	"School of Management and Labor Relations: Undergraduate",
	// 	"School of Management and Labor Relations: Graduate",
	// 	"School of Nursing",
	// 	"Continuous Education",
	// 	"Graduate Continuous Education"
	// ];

	// useEffect(() => {
	// 	const fetchPrograms = async () => {
	// 		try {
	// 			const majorsRequest = await fetch("http://127.0.0.1:8080/api/programs", {
	// 				method: "GET",
	// 				headers: {
	// 					"Content-Type": "application/json"
	// 				}
	// 			});
	// 			const data = await majorsRequest.json();
	// 			setPrograms(data.programs);
	// 		} catch (error) {
	// 			console.error("Error fetching programs:", error);
	// 		}
	// 	};

	// 	fetchPrograms();
	// }, []);
	// useEffect(() => {
	// 	// const courses = [
	// 	// 	"Computer Science 101",
	// 	// 	"Data Structures",
	// 	// 	"Introduction to Algorithms",
	// 	// 	"Software Engineering",
	// 	// 	"Database Management Systems",
	// 	// 	"Operating Systems",
	// 	// 	"Artificial Intelligence",
	// 	// 	"Machine Learning",
	// 	// 	"Computer Networks",
	// 	// 	"Cybersecurity",
	// 	// 	"Cloud Computing",
	// 	// 	"Web Development",
	// 	// 	"Mobile App Development",
	// 	// 	"Game Development",
	// 	// 	"Robotics",
	// 	// 	"Data Science",
	// 	// 	"Computer Security",
	// 	// 	"Cryptography",
	// 	// 	"Big Data Analytics",
	// 	// 	"Natural Language Processing",
	// 	// 	"Computer Graphics",
	// 	// 	"Computational Biology",
	// 	// 	"Blockchain Technology",
	// 	// 	"Internet of Things",
	// 	// 	"Digital Signal Processing"
	// 	// ];
	// 	if (courseQuery != "") {
	// 		setFilteredCourses(
	// 			courses.filter(course => course.toLowerCase().includes(courseQuery.toLowerCase()))
	// 		);
	// 	} else {
	// 		setFilteredCourses(courses);
	// 	}
	// }, [courseQuery]);

	// useEffect(() => {
	// 	setFilteredMajors(
	// 		programs.filter(
	// 			program =>
	// 				program.program_type === "major" &&
	// 				program.program_name.toLowerCase().includes(majorQuery.toLowerCase())
	// 		)
	// 	);
	// }, [programs, majorQuery]);

	// useEffect(() => {
	// 	setFilteredMinors(
	// 		programs.filter(
	// 			program =>
	// 				program.program_type === "minor" &&
	// 				program.program_name.toLowerCase().includes(minorQuery.toLowerCase())
	// 		)
	// 	);
	// }, [programs, minorQuery]);

	// useEffect(() => {
	// 	setFilteredCertificate(
	// 		programs.filter(
	// 			program =>
	// 				program.program_type === "certificate" &&
	// 				program.program_name.toLowerCase().includes(certificateQuery.toLowerCase())
	// 		)
	// 	);
	// }, [programs, certificateQuery]);
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
				const response = await fetch(`${backendUrl}/api/users/program?username=admin`);
				const data = await response.json();
				setSelectedPrograms(data.student_program);
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};
		const fetchUserDetails = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/users/details?username=admin`);
				const data = await response.json();
				const fields = {
					grad_date: setGradYear,
					enroll_date: setEnrolledYear,
					gpa: setGpa,
					class_year: setClassYear
				};
				console.log(data);
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
	}, []);

	// useEffect(() => {
	// 	const { major, minor, certificate, course } = query;
	// 	const lowerCase = str => str.toLowerCase();

	// 	const filtered = {
	// 		filteredCourses: course
	// 			? data.courses.filter(c => lowerCase(c).includes(lowerCase(course)))
	// 			: data.courses,
	// 		filteredMajors: [],
	// 		filteredMinors: [],
	// 		filteredCertificates: []
	// 	};

	// 	data.programs.forEach(program => {
	// 		const name = lowerCase(program.program_name);
	// 		if (program.program_type === "major" && name.includes(lowerCase(major))) {
	// 			filtered.filteredMajors.push(program);
	// 		} else if (program.program_type === "minor" && name.includes(lowerCase(minor))) {
	// 			filtered.filteredMinors.push(program);
	// 		} else if (
	// 			program.program_type === "certificate" &&
	// 			name.includes(lowerCase(certificate))
	// 		) {
	// 			filtered.filteredCertificates.push(program);
	// 		}
	// 	});

	// 	setData(prev => ({ ...prev, ...filtered }));
	// }, [query, data.programs, data.courses]);

	// TODO: handle accounts
	useEffect(() => {
		if (!courses) return;

		const filteredCourses = courseQuery
			? courses.filter(c => c.toLowerCase().includes(courseQuery.toLowerCase()))
			: courses;
		setFilteredCourses(filteredCourses);
	}, [courseQuery, courses]);

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
		const response = await fetch(`${backendUrl}/api/users/program`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username: "admin", program_id: program_id })
		});
		const data = await response.json();
		console.log(data);
		if (data.status === "success") {
			console.log(data);
			console.log(selectedPrograms);
			setSelectedPrograms(prev => [...prev, data.student_program]);
		} else {
		}
		// TODO: handle errors
	};

	const handleRemoveProgram = async program_id => {
		const response = await fetch(`${backendUrl}/api/users/program`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
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
				"Content-Type": "application/json"
			},
			body: JSON.stringify(
				Object.fromEntries(
					Object.entries({
						username: "admin",
						grad_date: gradYear,
						enroll_date: enrolledYear,
						gpa: gpa,
						class_year: classYear
					}).filter(([_, value]) => value !== "")
				)
			)
		});
		console.log(response);
		//TODO: redirect
		if (data.status == "success") {
			redirect("/home");
		} else {
		}
	};

	return (
		<>
			<div className="flex gap-5 justify-end">
			<Navbar/>
				<div className="flex flex-col gap-3">
					{/* <div className="flex flex-row gap-5 items-center">
					<label
						className=""
						htmlFor="graduation-year">
						GPA:
					</label>
					<input
						type="text"
						id="graduation-year"
						value={}
						onChange={}
						maxLength={4}
						placeholder="Enter year"
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
						value={}
						onChange={}
						maxLength={4}
						placeholder="Enter year"
						className="border border-gray-300 p-2 rounded"
					/>
		</div> */}
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
					{/* <ListContainer
						query={query.major}
						handleQueryChange={event => updateQuery("major", event.target.value)}
						values={data.filteredMajors}
						searchText="Search Major By Name"
						type="Major"
						field="program_name"
						key_field="program_id"
						buttonType="add"
						handleButtonClick={handleInsertProgram}
					/>
					<ListContainer
						query={query.minor}
						handleQueryChange={event => updateQuery("minor", event.target.value)}
						searchText="Search Minor By Name"
						values={data.filteredMinors}
						type="Minor"
						field="program_name"
						key_field="program_id"
						buttonType="add"
						handleButtonClick={handleInsertProgram}
					/>
					<ListContainer
						query={query.certificate}
						handleQueryChange={event => updateQuery("certificate", event.target.value)}
						searchText="Search Certificate By Name"
						values={data.filteredCertificates}
						type="Certificate"
						field="program_name"
						key_field="program_id"
						buttonType="add"
						handleButtonClick={handleInsertProgram}
					/> */}

					{/* <ListContainer
					query={query.selectedPrograms}
					handleQueryChange={event => setQueryChange(event.target.value)}
					searchText="Search Selected Programs By Name"
					values={data.filteredSelectedCourses}
					type="Courses"
				/> */}
				</div>
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
			<div className="flex justify-end mt-5">
				<Button
					className="bg-blue-500 text-white p-1 rounded w-20"
					label="Save"
					onClick={saveData}
				/>
			</div>
		</>
	);
};

export default Questionnaire;
