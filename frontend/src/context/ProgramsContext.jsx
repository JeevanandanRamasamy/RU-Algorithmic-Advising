// src/context/ProgramsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProgramsContext = createContext();

export const ProgramsProvider = ({ children }) => {
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
				setPrograms(data.programs);
				setFilteredPrograms(data.programs);
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};

		const fetchUserPrograms = async () => {
			if (!user) return;
			try {
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
				console.error("Error fetching user programs:", error);
			}
		};

		fetchPrograms();
		fetchUserPrograms();
	}, [user, token]);

	useEffect(() => {
		if (!programs) return;

		const filtered = programsQuery
			? programs.filter(p =>
					p.program_name.toLowerCase().includes(programsQuery.toLowerCase())
			  )
			: programs;

		setFilteredPrograms(filtered);
	}, [programsQuery, programs]);

	useEffect(() => {
		if (!selectedPrograms) return;

		const filtered = selectedProgramsQuery
			? selectedPrograms.filter(p =>
					p.program_name.toLowerCase().includes(selectedProgramsQuery.toLowerCase())
			  )
			: selectedPrograms;

		setFilteredSelectedPrograms(filtered);
	}, [selectedProgramsQuery, selectedPrograms]);

	const handleInsertProgram = async program_id => {
		try {
			const response = await fetch(`${backendUrl}/api/users/programs`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					username: user,
					program_id
				})
			});
			const data = await response.json();
			if (response.ok) {
				setSelectedPrograms(prev => [...prev, data.student_program]);
			}
		} catch (error) {
			console.error("Error inserting program:", error);
		}
	};

	const handleRemoveProgram = async program_id => {
		try {
			const response = await fetch(`${backendUrl}/api/users/programs`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ username: user, program_id })
			});
			const data = await response.json();
			if (response.ok) {
				setSelectedPrograms(prev =>
					prev.filter(p => p.program_id !== data.student_program.program_id)
				);
			}
		} catch (error) {
			console.error("Error removing program:", error);
		}
	};

	return (
		<ProgramsContext.Provider
			value={{
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
			}}>
			{children}
		</ProgramsContext.Provider>
	);
};

export const usePrograms = () => useContext(ProgramsContext);
