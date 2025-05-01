import { useState, useEffect, useCallback } from "react";

const useSemester = () => {
	const generateUrl = (term, year, selectedIndexes) => {
		if (!selectedIndexes) {
			return;
		}
		const base = "https://sims.rutgers.edu/webreg/editSchedule.htm";
		console.log(selectedIndexes);
		const indexListParam = selectedIndexes.join(",");
		const semester = getSemesterCode(term, year);

		return `${base}?login=cas&semesterSelection=${semester}&indexList=${indexListParam}`;
	};
	function getSemesterCode(term, year) {
		let termCode;

		switch (term) {
			case "spring":
				termCode = "1";
				break;
			case "fall":
				termCode = "9";
				break;
			case "winter":
				termCode = "0";
				break;
			case "summer":
				termCode = "7";
				break;
		}

		return termCode + year;
	}
	return { getSemesterCode, generateUrl };
};

export default useSemester;
