import React, { useEffect } from "react";
import CheckboxDropdownTable from "../generic/CheckBoxDropdownTable";

const SelectSections = ({
	courseRecords,
	term,
	year,
	selectedCourses,
	setSelectedCourses,
	checkedSections,
	setCheckedSections
}) => {
	console.log(courseRecords);
	// console.log(selectedCourses);
	// useEffect(() => {
	// 	setSelectedSections({});
	// }, [term, year]);

	return (
		<CheckboxDropdownTable
			courseRecords={courseRecords}
			selectedCourses={selectedCourses}
			setSelectedCourses={setSelectedCourses}
			checkedSections={checkedSections}
			setCheckedSections={setCheckedSections}
		/>
	);
};

export default SelectSections;
