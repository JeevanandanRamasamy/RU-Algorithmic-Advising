import React, { useEffect } from "react";
import CheckboxDropdownTable from "../generic/CheckBoxDropdownTable";

const SelectSections = ({
	courseRecords,
	term,
	year,
	selectedCourses,
	setSelectedCourses,
	checkedSections,
	setCheckedSections,
	toggleSectionSelect,
	isSectionSelected,
	handleSelectAll,
	isAllSectionsSelected
}) => {
	//TODO: what if no sections
	return (
		<CheckboxDropdownTable
			courseRecords={courseRecords}
			selectedCourses={selectedCourses}
			setSelectedCourses={setSelectedCourses}
			checkedSections={checkedSections}
			setCheckedSections={setCheckedSections}
			toggleSectionSelect={toggleSectionSelect}
			isSectionSelected={isSectionSelected}
			handleSelectAll={handleSelectAll}
			isAllSectionsSelected={isAllSectionsSelected}
		/>
	);
};

export default SelectSections;
