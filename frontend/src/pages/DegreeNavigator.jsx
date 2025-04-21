import React, { useState } from "react";
import ProgramSelect from "../components/degreeNavigator/ProgramSelect";
import RequirementTree from "../components/degreeNavigator/RequirementTree";
import TakenCourses from "../components/degreeNavigator/TakenCourses";

const DegreeNavigator = () => {
  const [selectedProgram, setSelectedProgram] = useState("");

  return (
    <div className="degree-planner-page">
      <h1>Degree Navigator</h1>

      {/* 📌 Program Selector */}
      <ProgramSelect onSelect={setSelectedProgram} />

      {/* 📌 Taken Courses */}
      <TakenCourses username="testS" />

      {/* 📌 Requirement Tree */}
      {selectedProgram && (
        <RequirementTree programId={selectedProgram} username="testS" />
      )}
    </div>
  );
};

export default DegreeNavigator;
