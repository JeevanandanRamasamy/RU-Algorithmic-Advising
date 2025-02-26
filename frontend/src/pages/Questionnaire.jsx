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
	const [selectedSubject, setSelectedSubject] = useState("");
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
	majors = [
		"Accounting",
		"Global Humanities",
		"African, Middle Eastern and South Asian Languages and Literatures",
		"Africana Studies",
		"Agriculture and Food Systems",
		"Agriculture and Food Systems: Teacher Education Track",
		"Agriculture and Food Systems",
		"American Studies",
		"Animal Science, Preveterinary Medicine and Research Option",
		"Animal Science, Companion Animal Science",
		"Animal Science, Laboratory Animal Science Option",
		"Animal Science, Equine and Production Animal Science",
		"Cultural Anthropology",
		"Anthropology",
		"Evolutionary Anthropology",
		"Art",
		"Visual Arts",
		"Art History",
		"Asian Studies",
		"Astrophysics",
		"Biochemistry - Biochemistry of Microbial Systems Option",
		"Biochemistry - Biochemical Toxicology Option",
		"Biochemistry - Biochemistry of Plant Systems Option",
		"Biochemistry - Protein and Structural Biochemistry Option",
		"Biochemistry - General Option",
		"Biological Sciences",
		"Biomathematics",
		"Biotechnology, Bioscience Policy and Management Option",
		"Biotechnology, Microbial Biotechnology Option",
		"Biotechnology, Bioinformatics Option",
		"Biotechnology, Plant Biotechnology Option",
		"Biotechnology, Animal Biotechnology Option",
		"Biotechnology, General Biotechnology Option",
		"Business Analytics and Information Technology",
		"Cell Biology and Neuroscience - Honors",
		"Cell Biology and Neuroscience",
		"Chemistry, Chemical Biology Option",
		"Chemistry, Environmental Option",
		"Chemistry, Business - Law Option",
		"Chemistry, Chemical Physics Option",
		"Chemistry, General ACS Option",
		"Chemistry, Core Option",
		"Chemistry, Forensic Chemistry Option",
		"Chinese",
		"Cinema Studies",
		"Cognitive Science",
		"Classics, Greek Option",
		"Classics, Greek and Latin Option",
		"Classics, Latin Option",
		"Classics, Classical Humanities Option",
		"Communication - Specialization in Health and Wellness Communication",
		"Communication",
		"Communication - Specialization in Leadership in Organizations and Community",
		"Communication - Specialization in Strategic Public Communication and Public Relations",
		"Communication - Specialization in Relationships and Family Communication",
		"Communication - Specialization in Communication and Technology",
		"Comparative Literature - Option in Advanced Studies in Comparative Literature",
		"Comparative Literature",
		"Computer Science - B.A.",
		"Computer Science - B.S.",
		"Criminal Justice",
		"Criminal Justice",
		"Dance",
		"Dance",
		"Dance - Dance Science Concentration",
		"Design",
		"Filmmaking",
		"Ecology, Evolution and Natural Resources - Urban Forestry Option",
		"Ecology, Evolution and Natural Resources",
		"Ecology, Evolution and Natural Resources - Nat Res & Ecosystem Mgmt Option",
		"Data Science - Chemical Data Science Option B.S.",
		"Data Science - Economics Option B.S.",
		"Data Science - Societal Impact Option B.A.",
		"Data Science - Computer Science Option B.S.",
		"Data Science - Statistics Option B.A.",
		"Economics",
		"English",
		"European Studies",
		"Entomology",
		"Environmental and Business Economics, Environmental and Natural Resource Economics Option",
		"Environmental and Business Economics, Food Industry Economics Option",
		"Environmental and Business Economics, Business Economics Option",
		"Environmental and Business Economics, Food Science and Management Economics",
		"Environmental Policy, Institutions and Behavior",
		"Environmental Sciences, Environmental Health Option",
		"Environmental Sciences, Environmental Science Option",
		"Environmental Sciences, Applied Environmental Science Option",
		"Exercise Science",
		"Exercise Science - Pre-Physical Therapy",
		"Environmental Studies",
		"Finance - Fixed Income and Credit Analysis Option",
		"Finance",
		"Food Science, One Pathway",
		"French- Interdisciplinary",
		"French",
		"Genetics",
		"Geography",
		"Earth and Planetary Sciences, Environmental Geology Option",
		"Earth and Planetary Sciences, Geological Sciences Option",
		"Earth and Planetary Sciences, General Option",
		"Earth and Planetary Sciences, Planetary Science Option",
		"German",
		"Health Administration - Direct Admits Option",
		"Health Administration",
		"History, Ancient History and Classics Option",
		"History",
		"History - French",
		"History - Political Science",
		"Human Resource Management - Honors",
		"Human Resource Management",
		"Information Technology and Informatics",
		"Landscape Architecture",
		"Interdisciplinary Studies-SEBS",
		"Italian Studies",
		"Italian",
		"Jewish Studies",
		"Jewish Studies - Advanced Language Option",
		"Japanese",
		"Journalism and Media Studies - Specialization in Global Media",
		"Journalism and Media Studies",
		"Journalism and Media Studies - Specialization in Sports Journalism",
		"Environmental Planning",
		"Korean",
		"Labor Studies and Employment Relations",
		"Labor and Employment Relations",
		"Labor and Employment Relations Online",
		"Labor and Employment Relations Online",
		"Latin American Studies",
		"Latino and Caribbean Studies",
		"Leadership and Management",
		"Linguistics with Certificate in Speech and Hearing Sciences",
		"Linguistics",
		"Marine Sciences, Marine Chemistry Option",
		"Marine Sciences, Marine Geology Option",
		"Marine Sciences, Physical Oceanography Option",
		"Marine Sciences, Directed Marine Studies Option",
		"Marine Sciences, Marine Biology - Biological Oceanography Option",
		"Marketing",
		"Marketing with Certification in Professional Selling",
		"Mathematics",
		"Mathematics, Actuarial Option",
		"Medieval Studies",
		"Meteorology",
		"Microbiology",
		"Middle Eastern Studies",
		"Middle Eastern Studies",
		"Molecular Biology and Biochemistry",
		"Music",
		"Music - Composition Option",
		"Music - Music Education Instrumental Option",
		"Music - Performance - Instrumental Option",
		"Music - Performance - Voice Option",
		"Music - Music Education Vocal General - Voice Option",
		"Music - Jazz Option",
		"Ecology, Evolution and Natural Resources",
		"Nursing - Blackwood Program",
		"Nursing - Accelerated Bachelor of Science in Nursing",
		"Nursing",
		"Nursing - RN-BS Degree",
		"Nutritional Sciences, Dietetics Option",
		"Nutritional Sciences, Food Service Administration Option",
		"Nutritional Sciences, Community Nutrition Option",
		"Nutritional Sciences - Pre-Dietetic",
		"Nutritional Sciences, Biomedical Nutrition Option",
		"Nutritional Sciences - Pre-Nutritional Sciences",
		"Pharmacy",
		"Philosophy",
		"Physics - Professional Option",
		"Physics - Engineering Dual Degree Option",
		"Physics - General Option",
		"Physics - Planetary Option",
		"Physics, Applied Option",
		"Planning and Public Policy - Direct Admits Option",
		"Plant Science, Plant Agriculture and Horticulture",
		"Plant Science, Natural Products",
		"Plant Science, General Plant Biology Option",
		"Political Science",
		"Supply Chain Management",
		"Portuguese",
		"Psychology - Honors",
		"Psychology",
		"Public Health - Direct Admits Option",
		"Public Health",
		"Public Policy - Direct Admits Option",
		"Public Policy",
		"Religion",
		"Russian",
		"Social Work",
		"Sociology",
		"Spanish - Spanish Intensive Option",
		"Spanish",
		"Sport Management",
		"Statistics",
		"Statistics - Mathematics",
		"Theater Arts",
		"Theater Arts - Acting Concentration",
		"Theater Arts - Acting Concentration",
		"Theater Arts - Costume Technology Concentration",
		"Theater Arts - Lighting Design Concentration",
		"Theater Arts - Stage Management Concentration",
		"Theater Arts - Costume Design Concentration",
		"Theater Arts - Technical Direction Concentration",
		"Theater Arts - Set Design Concentration",
		"Theater Arts - Dramaturgy Concentration",
		"Urban Planning and Design - Direct Admits Option",
		"Urban Planning and Design",
		"Women's and Gender Studies"
	];

	subjects = [
		"Accounting (010)",
		"Administrative Studies (011)",
		"African Studies (016)",
		"African, Middle Eastern, and South Asian Languages and Literatures (013)",
		"Africana Studies (014)",
		"Agricultural and Natural Resource Management (035)",
		"Agriculture and Food Systems (020)",
		"Alcohol Studies (047)",
		"American Studies (050)",
		"Animal Science (067)",
		"Anthropology (070)",
		"Arabic Languages (074)",
		"Armenian (078)",
		"Art (080)",
		"Art (081)",
		"Art History (082)",
		"Arts and Sciences (090)",
		"Asian Studies (098)",
		"Biochemistry (115)",
		"Bioenvironmental Engineering (117)",
		"Biological Sciences (119)",
		"Biomathematics (122)",
		"Biomedical Engineering (125)",
		"Biotechnology (126)",
		"Business Analytics and Information Technology (136)",
		"Business Law (140)",
		"Cell Biology and Neuroscience (146)",
		"Chemical Biology (158)",
		"Chemical and Biochemical Engineering (155)",
		"Chemistry (160)",
		"Chinese (165)",
		"Cinema Studies (175)",
		"Civil and Environmental Engineering (180)",
		"Classics (190)",
		"Cognitive Science (185)",
		"Communication (192)",
		"Communication and Media Studies (189)",
		"Community Health Outreach (193)",
		"Comparative Literature (195)",
		"Computer Science (198)",
		"Criminal Justice (202)",
		"Dance (203)",
		"Dance (206)",
		"Dance Education (207)",
		"Data Science (219)",
		"Ecology, Evolution and Natural Resources (216)",
		"Economics (220)",
		"Education (300)",
		"Educational Opportunity Fund (364)",
		"Electrical and Computer Engineering (332)",
		"English - Composition and Writing (355)",
		"English - Creative Writing (351)",
		"English - Film Studies (354)",
		"English - Literature (358)",
		"English - Theories and Methods (359)",
		"English as a Second Language (356)",
		"Entomology (370)",
		"Entrepreneurship (382)",
		"Environmental Planning and Design (573)",
		"Environmental Policy, Institutions and Behavior (374)",
		"Environmental Sciences (375)",
		"Environmental Studies (381)",
		"Environmental and Biological Sciences (015)",
		"Environmental and Business Economics (373)",
		"Ethics in Business Environment (522)",
		"European Studies (360)",
		"Exercise Science (377)",
		"Filmmaking (211)",
		"Finance (390)",
		"Food Science (400)",
		"French (420)",
		"General Engineering (440)",
		"Genetics (447)",
		"Geography (450)",
		"Geological Sciences (460)",
		"German (470)",
		"Greek (490)",
		"Greek, Modern (489)",
		"Health Administration (501)",
		"Hindi (505)",
		"History (510)",
		"History - Africa, Asia, Latin America (508)",
		"History - American (512)",
		"History - General/Comparative (506)",
		"Human Resource Management (533)",
		"Hungarian (535)",
		"Industrial and Systems Engineering (540)",
		"Information Technology and Informatics (547)",
		"Interdisciplinary - Mason Gross (557)",
		"Interdisciplinary Studies (554)",
		"Interdisciplinary Studies - Arts and Sciences (556)",
		"International Studies (558)",
		"Italian (560)",
		"Japanese (565)",
		"Jewish Studies (563)",
		"Journalism and Media Studies (567)",
		"Korean (574)",
		"Labor Studies (575)",
		"Landscape Architecture (550)",
		"Languages and Cultures (617)",
		"Latin (580)",
		"Latin American Studies (590)",
		"Latino and Hispanic Caribbean Studies (595)",
		"Leadership Skills (607)",
		"Linguistics (615)",
		"Management (620)",
		"Management and Work (624)",
		"Marine Sciences (628)",
		"Marketing (630)",
		"Materials Science and Engineering (635)",
		"Mathematics (640)",
		"Mechanical and Aerospace Engineering (650)",
		"Medical Ethics and Policy (652)",
		"Medieval Studies (667)",
		"Meteorology (670)",
		"Microbiology (680)",
		"Middle Eastern and Islamic Studies (685)",
		"Military Education, Air Force (690)",
		"Military Education, Army (691)",
		"Military Education, Navy (692)",
		"Molecular Biology and Biochemistry (694)",
		"Music (700)",
		"Music, Applied (701)",
		"Nursing (705)",
		"Nutritional Sciences (709)",
		"Organizational Leadership (713)",
		"Persian (723)",
		"Pharmaceutical Chemistry (715)",
		"Pharmaceutics (721)",
		"Pharmacology, Cellular and Molecular (718)",
		"Pharmacy (720)",
		"Pharmacy Practice and Administration (725)",
		"Philosophy (730)",
		"Physician Assistant (745)",
		"Physics (750)",
		"Planning and Public Policy (762)",
		"Plant Science (776)",
		"Policy, Health, and Administration (775)",
		"Polish (787)",
		"Political Science (790)",
		"Portuguese (810)",
		"Psychology (830)",
		"Public Administration and Management (843)",
		"Public Health (832)",
		"Public Policy (833)",
		"Real Estate (851)",
		"Religion (840)",
		"Russian (860)",
		"SEBS Internship (902)",
		"Social Justice (904)",
		"Social Work (910)",
		"Sociology (920)",
		"Spanish (940)",
		"Sport Management (955)",
		"Statistics (960)",
		"Study Abroad (959)",
		"Supply Chain and Marketing Science (799)",
		"Theater (965)",
		"Theater Arts (966)",
		"Turkish (973)",
		"Urban Planning and Design (971)",
		"Urban Studies and Community Development (975)",
		"Women's, Gender, and Sexuality Studies (988)",
		"World Languages (991)"
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
			<Dropdown
				options={subjects}
				selectedValue={selectedSubject}
				onChange={event => setSelectedSubject(event.target.value)}
				placeholder="-- Select a Subject --"
			/>
		</>
	);
};

export default Questionnaire;
