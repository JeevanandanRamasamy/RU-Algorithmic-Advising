import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * A component that allows the user to select a program from a list.
 * It fetches programs with their requirements from the backend and passes the
 * selected program's ID back to the parent component.
 */
const ProgramSelect = ({ onSelect }) => {
	const [programs, setPrograms] = useState([]);
	const [selectedProgram, setSelectedProgram] = useState("");

	// Fetch program data from the backend on component mount
	useEffect(() => {
		const fetchPrograms = async () => {
			try {
				const res = await fetch(
					`${backendUrl}/api/degree_navigator/programs/with-requirements`
				);
				const data = await res.json();
				setPrograms(data);
			} catch (err) {
				console.error("Failed to fetch programs:", err);
			}
		};

		fetchPrograms();
	}, []);

	// Handle program selection change
	const handleChange = e => {
		const programId = e.target.value;
		setSelectedProgram(programId);
		onSelect(programId);
	};

	return (
		<div>
			<label htmlFor="program-select">Select a Program: </label>
			<select
				id="program-select"
				value={selectedProgram}
				onChange={handleChange}>
				<option value="">-- Choose a Program --</option>
				{programs.map(program => (
					<option
						key={program.program_id}
						value={program.program_id}>
						{program.program_name}
					</option>
				))}
			</select>
		</div>
	);
};

export default ProgramSelect;
