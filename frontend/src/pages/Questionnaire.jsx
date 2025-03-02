import { useState } from "react";
import Dropdown from "../components/Dropdown";
import { useEffect } from "react";
import CourseTakenList from "../components/CourseTakenList";
import DropdownWithSearch from "../components/DropdownWithSearch";
import Button from "../components/Button";
import { majors, minors, subjects, certificate } from "../data/sas";
import ListContainer from "../components/ListContainer";

const Questionnaire = () => {
	const [gradYear, setGradYear] = useState("");
	const [courseQuery, setCourseQuery] = useState("");
	const [majorQuery, setMajorQuery] = useState("");
	const [minorQuery, setMinorQuery] = useState("");
	const [certificateQuery, setCertificateQuery] = useState("");
	const [filteredCourses, setFilteredCourses] = useState([]);
	const [filteredMajors, setFilteredMajors] = useState([]);
	const [filteredMinors, setFilteredMinors] = useState([]);
	const [filteredCertificate, setFilteredCertificate] = useState([]);

	const handleGradYearChange = event => {
		const value = event.target.value;

		if (/^\d{0,4}$/.test(value)) {
			setGradYear(value);
		}
	};
	const handleCourseQueryChange = event => {
		setCourseQuery(event.target.value);
	};

	// TODO: get all schools/ data from backend
	const schools = [
		"School of Arts and Sciences",
		"Mason Gross School of the Arts",
		"Graduate Mason Gross School of the Arts",
		"Edward J. Bloustein School of Planning and Public Policy: Undergraduate",
		"School of Environmental and Biological Sciences",
		"School of Engineering",
		"Graduate School of Education",
		"School of Graduate Studies–New Brunswick",
		"School of Communication and Information",
		"Graduate School of Applied and Professional Psychology",
		"Graduate School of Social Work",
		"Ernest Mario School of Pharmacy*",
		"Graduate School of Pharmacy",
		"School of Business",
		"Edward J. Bloustein School of Planning and Public Policy: Graduate",
		"School of Management and Labor Relations: Undergraduate",
		"School of Management and Labor Relations: Graduate",
		"School of Nursing",
		"Continuous Education",
		"Graduate Continuous Education"
	];

	// TODO: get all majors/ data from backend

	useEffect(async () => {
		const programs = await fetch("http://127.0.0.1:8080/api/programs?majors", {
			headers: {
				"Content-Type": "application/json"
			}
		});
		console.log(programs);
	}, []);
	useEffect(() => {
		const courses = [
			"Computer Science 101",
			"Data Structures",
			"Introduction to Algorithms",
			"Software Engineering",
			"Database Management Systems",
			"Operating Systems",
			"Artificial Intelligence",
			"Machine Learning",
			"Computer Networks",
			"Cybersecurity",
			"Cloud Computing",
			"Web Development",
			"Mobile App Development",
			"Game Development",
			"Robotics",
			"Data Science",
			"Computer Security",
			"Cryptography",
			"Big Data Analytics",
			"Natural Language Processing",
			"Computer Graphics",
			"Computational Biology",
			"Blockchain Technology",
			"Internet of Things",
			"Digital Signal Processing"
		];
		if (courseQuery != "") {
			setFilteredCourses(
				courses.filter(course => course.toLowerCase().includes(courseQuery.toLowerCase()))
			);
		} else {
			setFilteredCourses(courses);
		}
	}, [courseQuery]);

	useEffect(() => {
		setFilteredMajors(
			majors.filter(majors => majors.toLowerCase().includes(majorQuery.toLowerCase()))
		);
	}, [majorQuery]);

	useEffect(() => {
		setFilteredMinors(
			minors.filter(minors => minors.toLowerCase().includes(minorQuery.toLowerCase()))
		);
	}, [minorQuery]);

	useEffect(() => {
		setFilteredCertificate([]);
	}, [certificateQuery]);

	return (
		<>
			<div className="flex flex-col gap-3">
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
				<ListContainer
					query={majorQuery}
					handleQueryChange={event => setMajorQuery(event.target.value)}
					values={filteredMajors}
					searchText="Search Major By Name"
					type="Major"
				/>
				<ListContainer
					query={minorQuery}
					handleQueryChange={event => setMinorQuery(event.target.value)}
					searchText="Search Minor By Name"
					values={filteredMinors}
					type="Minor"
				/>
				<ListContainer
					query={certificateQuery}
					handleQueryChange={event => setCertificateQuery(event.target.value)}
					searchText="Search Certificate By Name"
					values={filteredCertificate}
					type="Certificate"
				/>
				<ListContainer
					query={courseQuery}
					handleQueryChange={event => setQueryChange(event.target.value)}
					searchText="Search Courses By Name"
					values={filteredCourses}
					type="Courses"
				/>
				<Button
					className="bg-blue-500 text-white p-1 rounded w-20"
					label="Save"
				/>
			</div>
		</>
	);
};

export default Questionnaire;
