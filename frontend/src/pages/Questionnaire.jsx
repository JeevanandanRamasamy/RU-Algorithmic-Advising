import { useState } from "react";

const Questionnaire = () => {
	const [selectedSchool, setSelectedSchool] = useState("");
	const handleSchoolChange = event => {
		setSelectedSchool(event.target.value);
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
	return (
		<>
			<label htmlFor="dropdown">Choose an option:</label>
			<select
				id="dropdown"
				value={selectedSchool}
				onChange={handleSchoolChange}>
				<option value="">-- Select an option --</option>
				{schools.map((option, index) => (
					<option
						key={index}
						value={option}>
						{option}
					</option>
				))}
			</select>
			{selectedSchool && <p>You selected: {selectedSchool}</p>}
			<input />

			<input />
			<input />
			<input />
		</>
	);
};

export default Questionnaire;
