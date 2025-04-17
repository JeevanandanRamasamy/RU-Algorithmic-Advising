import React, { useState } from "react";
import ProgramSelect from "../components/degreePlanner/ProgramSelect";
import RequirementTree from "../components/degreePlanner/RequirementTree";

const DegreePlannerPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <div>
      <h1>Degree Planner</h1>
      <ProgramSelect onSelect={setSelectedProgram} />
      {selectedProgram && <RequirementTree programId={selectedProgram} />}
    </div>
  );
};

export default DegreePlannerPage;
