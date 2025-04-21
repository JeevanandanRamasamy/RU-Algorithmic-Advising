import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProgramSelect = ({ onSelect }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");

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

  const handleChange = (e) => {
    const programId = e.target.value;
    setSelectedProgram(programId);
    onSelect(programId); // Pass selected programId to parent component
  };

  return (
    <div>
      <label htmlFor="program-select">Select a Program:</label>
      <select
        id="program-select"
        value={selectedProgram}
        onChange={handleChange}
      >
        <option value="">-- Choose a Program --</option>
        {programs.map((program) => (
          <option key={program.program_id} value={program.program_id}>
            {program.program_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProgramSelect;
