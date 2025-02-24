import { useState } from "react";
import Dropdown from "../components/Dropdown";
import { useEffect } from "react";
import CourseTakenList from "../components/CourseTakenList";
import Button from "../components/Button";

const Questionnaire = () => {
	const [selectedSchool, setSelectedSchool] = useState("");
	const [selectedMajor, setSelectedMajor] = useState("");
	const [gradYear, setGradYear] = useState("");
	const [courseQuery, setCourseQuery] = useState("");
	const [selectedCourse, setSelectedCourse] = useState("");
	const [filteredCourses, setFilteredCourses] = useState([]);

	const handleGradYearChange = event => {
		const value = event.target.value;

		if (/^\d{0,4}$/.test(value)) {
			setGradYear(value);
		}
	};
	const handleCourseQueryChange = event => {
		setCourseQuery(event.target.value);
		console.log(courseQuery);
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
	const majors = [
		"Accounting",
		"Aerospace Engineering",
		"Agriculture and Food Systems",
		"American Studies",
		"Animal Science",
		"Anthropology",
		"Anthropology, Evolutionary",
		"Art",
		"Art History",
		"Arts Management and Leadership",
		"Asian Studies",
		"Astrophysics",
		"Biochemistry",
		"Biological Sciences",
		"Biomathematics",
		"Business Administration",
		"Economics",
		"Education as a Social Science",
		"English",
		"Environmental Studies",
		"Exercise Science",
		"Food Science",
		"Geography",
		"History",
		"Human Resource Management",
		"Information Technology and Informatics",
		"International and Global Studies",
		"Journalism and Media Studies",
		"Labor Studies and Employment Relations",
		"Linguistics",
		"Management",
		"Marketing",
		"Mathematics",
		"Mechanical Engineering",
		"Music",
		"Nursing",
		"Philosophy",
		"Physics",
		"Political Science",
		"Psychology",
		"Public Health",
		"Public Policy",
		"Religion",
		"Social Work",
		"Sociology",
		"Spanish",
		"Supply Chain Management",
		"Theater Arts",
		"Urban Planning and Design",
		"Women's and Gender Studies"
	];

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
			console.log(courses);

			setFilteredCourses(
				courses.filter(course => course.toLowerCase().includes(courseQuery.toLowerCase()))
			);
		} else {
			setFilteredCourses([]);
		}
	}, [courseQuery]);

	console.log(filteredCourses);
	return (
		<>
			<Dropdown
				options={schools}
				selectedValue={selectedSchool}
				onChange={event => setSelectedSchool(event.target.value)}
				placeholder="-- Select a School --"
			/>
			<Dropdown />
			<Dropdown
				options={majors}
				selectedValue={selectedMajor}
				onChange={event => setSelectedMajor(event.target.value)}
				placeholder="-- Select a Major --"
			/>
			<label htmlFor="graduation-year">Graduation Year: </label>
			<input
				type="text"
				id="graduation-year"
				value={gradYear}
				onChange={handleGradYearChange}
				maxLength={4}
				placeholder="Enter year"
				className="border border-gray-300 p-2 rounded"
			/>
			<div>
				<input
					type="text"
					id="course"
					value={courseQuery}
					onChange={handleCourseQueryChange}
					placeholder="Search Courses By Name"
					className="w-64 border border-gray-300 p-2 rounded"
				/>
				<CourseTakenList filteredCourses={filteredCourses} />
			</div>
			<Button
				className="bg-blue-500 text-white p-1 rounded w-20"
				label="Skip"
			/>
		</>
	);
};

export default Questionnaire;
