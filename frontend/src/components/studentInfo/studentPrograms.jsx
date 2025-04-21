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
	handleRemoveProgram
}) => {
	return (
		// <div className="flex gap-[20px] pt-[10x] pb-[10px]">
		<>
			<div className="p-2 border border-gray-200 rounded-md bg-white">
				<ListContainer
					query={programsQuery}
					handleQueryChange={event => setProgramsQuery(event.target.value)}
					values={filteredPrograms}
					searchText="Search Program By Name"
					type="Program"
					field="program_name"
					key_field="program_id"
					buttonType="+"
					handleButtonClick={handleInsertProgram}
					excludedByKeys={
						filteredSelectedPrograms
							? filteredSelectedPrograms.map(program => program?.program_id)
							: []
					}
				/>
			</div>
			<div className="p-2 border border-gray-200 rounded-md bg-white">
				<ListContainer
					query={selectedProgramsQuery}
					handleQueryChange={event => setSelectedProgramsQuery(event.target.value)}
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
