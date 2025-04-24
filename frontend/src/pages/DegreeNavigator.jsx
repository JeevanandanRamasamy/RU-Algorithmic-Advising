import React, { useState } from "react";
import ProgramSelect from "../components/degreeNavigator/ProgramSelect";
import RequirementTree from "../components/degreeNavigator/RequirementTree";
import TakenCourses from "../components/degreeNavigator/TakenCourses";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";

const DegreeNavigator = () => {
  const [selectedProgram, setSelectedProgram] = useState("");
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left: Navbar */}
      <div className="w-[80px] bg-yellow-100 shadow-md">
        <Navbar />
      </div>

      {/* Right: Main Content */}
      <div className="flex-1 px-6 py-8">
        {" "}
        {/* ↓ changed padding to px-6 instead of p-8 */}
        <h1 className="text-2xl font-bold mb-6">Degree Navigator</h1>
        <div className="mb-6">
          <ProgramSelect onSelect={setSelectedProgram} />
        </div>
        {user && (
          <div className="mb-6">
            <TakenCourses username={user} />
          </div>
        )}
        {user && selectedProgram && (
          <div>
            <RequirementTree programId={selectedProgram} username={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DegreeNavigator;
