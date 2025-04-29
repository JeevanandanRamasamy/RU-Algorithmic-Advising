import React, { useEffect } from "react";
import CheckboxDropdownTable from "../generic/CheckBoxDropdownTable";
import OpenClosedLegend from "../calendar/OpenClosedLegend";

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
	return (
		<>
			<OpenClosedLegend />
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
		</>
	);
};

export default SelectSections;
