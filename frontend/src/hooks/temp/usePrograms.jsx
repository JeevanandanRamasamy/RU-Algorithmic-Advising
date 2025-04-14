import { useState, useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";

const usePrograms = () => {
	const { user, token } = useAuth();
	const [selectedProgramsQuery, setSelectedProgramsQuery] = useState("");
	const [programs, setPrograms] = useState([]);
	const [programsQuery, setProgramsQuery] = useState("");
	const [selectedPrograms, setSelectedPrograms] = useState([]);
	const [filteredPrograms, setFilteredPrograms] = useState([]);
	const [filteredSelectedPrograms, setFilteredSelectedPrograms] = useState([]);

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
						"Authorization": `Bearer ${token}`
					}
				});
				const data = await response.json();
				setSelectedPrograms(data.student_program);
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};

		fetchPrograms();
		fetchUserPrograms();
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
		if (response.ok) {
			setSelectedPrograms(prev => [...prev, data.student_program]);
		} else {
			// console.log(data);
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
		// console.log(data);
		if (response.ok) {
			setSelectedPrograms(
				selectedPrograms.filter(p => p.program_id !== data.student_program.program_id)
			);
		}
		// TODO: handle errors
	};
	return {
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
	};
};
export default usePrograms;
