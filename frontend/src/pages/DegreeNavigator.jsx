/**
 * DegreeNavigator.jsx
 *
 * This page serves as the main Degree Navigator view for students.
 * It allows users to:
 * - Select a degree program from a dropdown.
 * - View the corresponding requirement tree for that program.
 * - See a list of completed (taken) courses.
 *
 * The page layout includes:
 * - A left sidebar with navigation, notifications, and chatbot.
 * - A right content area that adapts:
 *    - If a program is selected: shows RequirementTree and TakenCourses side-by-side.
 *    - If no program is selected: shows TakenCourses full-width.
 *
 */
import React, { useState } from "react";
import ProgramSelect from "../components/degreeNavigator/ProgramSelect";
import RequirementTree from "../components/degreeNavigator/RequirementTree";
import TakenCourses from "../components/degreeNavigator/TakenCourses";
import Navbar from "../components/navbar/Navbar";
import NotificationsButton from "../components/widgets/Notifications";
import Chatbot from "../components/widgets/Chatbot";
import { useAuth } from "../context/AuthContext";

const DegreeNavigator = () => {
  const [selectedProgram, setSelectedProgram] = useState("");
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left: Navbar */}
      <div className="w-[80px] bg-yellow-100 shadow-md">
        <Navbar />
        <NotificationsButton />
        <Chatbot />
      </div>

      {/* Right: Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="bg-yellow-100 p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800">
            🎓 Degree Navigator
          </h1>

          <div className="mb-6">
            <ProgramSelect onSelect={setSelectedProgram} />
          </div>

          {user && (
            <>
              {selectedProgram ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequirementTree
                      programId={selectedProgram}
                      username={user}
                    />
                  </div>
                  <div>
                    <TakenCourses username={user} />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <TakenCourses username={user} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DegreeNavigator;
