/**
 * studentPrograms Component
 *
 * This component displays two searchable, filterable lists:
 * - A list of available academic programs
 * - A list of programs selected by the student
 *
 * It uses the `ListContainer` component for both lists to support search input,
 * filtering, and interactive add/remove functionality with "+" and "–" buttons.
 *
 * Props:
 * - programsQuery (string): The current search query for available programs
 * - setProgramsQuery (function): Updates the available programs search input
 * - filteredPrograms (array): The filtered list of available programs
 * - selectedProgramsQuery (string): The current search query for selected programs
 * - setSelectedProgramsQuery (function): Updates the selected programs search input
 * - filteredSelectedPrograms (array): Filtered list of already-selected programs
 * - handleInsertProgram (function): Callback when a program is added from the available list
 * - handleRemoveProgram (function): Callback when a program is removed from the selected list
 */

import React from "react";
import ListContainer from "../generic/ListContainer";

const studentPrograms = ({
  programsQuery,
  setProgramsQuery,
  filteredPrograms,
  selectedProgramsQuery,
  setSelectedProgramsQuery,
  filteredSelectedPrograms,
  handleInsertProgram,
  handleRemoveProgram,
}) => {
  return (
    // <div className="flex gap-[20px] pt-[10x] pb-[10px]">
    <>
      <div className="p-2 border border-gray-200 rounded-md bg-white">
        <ListContainer
          query={programsQuery}
          handleQueryChange={(event) => setProgramsQuery(event.target.value)}
          values={filteredPrograms}
          searchText="Search Program By Name"
          type="Program"
          field="program_name"
          key_field="program_id"
          buttonType="+"
          handleButtonClick={handleInsertProgram}
          excludedByKeys={
            filteredSelectedPrograms
              ? filteredSelectedPrograms.map((program) => program?.program_id)
              : []
          }
        />
      </div>
      <div className="p-2 border border-gray-200 rounded-md bg-white">
        <ListContainer
          query={selectedProgramsQuery}
          handleQueryChange={(event) =>
            setSelectedProgramsQuery(event.target.value)
          }
          searchText="Search Selected Programs"
          values={filteredSelectedPrograms}
          field="program_name"
          key_field="program_id"
          buttonType="-"
          handleButtonClick={handleRemoveProgram}
        />
      </div>
    </>
    // </div>
  );
};

export default studentPrograms;
