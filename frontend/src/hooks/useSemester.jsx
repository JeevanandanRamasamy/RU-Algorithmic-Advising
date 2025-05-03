import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage semester-related logic.
 * Provides a function to generate a URL for a specific semester and set of courses,
 * and a helper to get the semester code based on the term and year.
 */
const useSemester = () => {
	/**
	 * Generates a URL for accessing the schedule page for a specific semester and selected courses.
	 *
	 * @param {string} term - The term (e.g., "spring", "fall", "winter", "summer").
	 * @param {number} year - The year (e.g., 2025).
	 * @param {Array} selectedIndexes - The indexes of the selected courses.
	 * @returns {string} The generated URL to access the schedule.
	 */
	const generateUrl = (term, year, selectedIndexes) => {
		if (!selectedIndexes) {
			return;
		}
		const base = "https://sims.rutgers.edu/webreg/editSchedule.htm";
		const indexListParam = selectedIndexes.join(",");
		const semester = getSemesterCode(term, year);

		return `${base}?login=cas&semesterSelection=${semester}&indexList=${indexListParam}`;
	};

	/**
	 * Helper function to get the semester code based on the term and year.
	 *
	 * @param {string} term - The term (e.g., "spring", "fall", "winter", "summer").
	 * @param {number} year - The year (e.g., 2025).
	 * @returns {string} The semester code in the format "termCode + year" (e.g., "12025" for Spring 2025).
	 */
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
