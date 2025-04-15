import React, { useEffect } from "react";
import CheckboxDropdownTable from "../generic/CheckBoxDropdownTable";

const SelectSections = ({ courseRecords, term, year, selectedSections, setSelectedSections }) => {
	useEffect(() => {
		setSelectedSections({});
	}, [term, year]);

	return <CheckboxDropdownTable selectedSections={selectedSections} />;
};

export default SelectSections;
