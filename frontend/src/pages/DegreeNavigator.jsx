import React, { useState } from "react";
import ProgramSelect from "../components/degreeNavigator/ProgramSelect";
import RequirementTree from "../components/degreeNavigator/RequirementTree";
import TakenCourses from "../components/degreeNavigator/TakenCourses";
import Navbar from "../components/navbar/Navbar";

const DegreeNavigator = () => {
  const [selectedProgram, setSelectedProgram] = useState("");

  return (
    <div className="degree-planner-page">
      <Navbar />

      {/* 📌 Page Title */}
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
