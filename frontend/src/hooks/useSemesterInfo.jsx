import React from "react";

/**
 * Custom hook for handling semester encoding, decoding, and semester generation.
 * Provides functions to encode/decode semester info, generate a list of semesters
 * within a range, and retrieve the current and next semesters.
 */
const useSemesterInfo = () => {
	/**
	 * Encodes a term and year into a unique integer value.
	 *
	 * @param {string} term - The term (e.g., "spring", "summer", "fall", "winter").
	 * @param {number} year - The year (e.g., 2025).
	 * @returns {number} The encoded semester value.
	 */
	const encodeSemester = (term, year) => {
		const termOffset = {
			spring: 0,
			summer: 1,
			fall: 2,
			winter: 3
		};
		return year * 4 + termOffset[term];
	};

	/**
	 * Decodes an encoded semester value back into a term and year.
	 *
	 * @param {number} encoded - The encoded semester value.
	 * @returns {Object} The decoded semester with term and year.
	 */
	const decodeSemester = encoded => {
		const terms = ["spring", "summer", "fall", "winter"];
		const year = Math.floor(encoded / 4);
		const term = terms[encoded % 4];
		return { term, year };
	};

	/**
	 * Generates an array of semesters from the enrollment year to the graduation year.
	 *
	 * @param {number} enrollYear - The year of enrollment.
	 * @param {number} gradYear - The year of graduation.
	 * @returns {Array} An array of semester objects between the start and end years.
	 */
	const generateSemesters = (enrollYear, gradYear) => {
		const semesters = [];
		const startEncoded = encodeSemester("fall", enrollYear);
		const endEncoded = encodeSemester("summer", gradYear);
		for (let encoded = startEncoded; encoded <= endEncoded; encoded++) {
			semesters.push(decodeSemester(encoded));
		}
		return semesters;
	};

	/**
	 * Retrieves the current semester (based on today's date).
	 *
	 * @returns {Object} The current semester (term and year).
	 */
	const getCurrentSemester = () => {
		const now = new Date();
		const month = now.getMonth() + 1;
		const year = now.getFullYear();

		let term;
		if (month === 12) {
			term = "winter";
		} else if (month >= 9) {
			term = "fall";
		} else if (month >= 6) {
			term = "summer";
		} else {
			term = "spring";
		}

		return { term, year };
	};

	/**
	 * Generates an array of semesters from the start year to the current semester.
	 *
	 * @param {number} startYear - The year from which to start generating semesters.
	 * @returns {Array} An array of semesters up to the current semester.
	 */
	const generateSemestersTillNow = startYear => {
		const semesters = [];
		const currentSemester = getCurrentSemester();
		const startEncoded = encodeSemester("fall", startYear);
		const endEncoded = encodeSemester(currentSemester.term, currentSemester.year);
		for (let encoded = startEncoded; encoded <= endEncoded; encoded++) {
			semesters.push(decodeSemester(encoded));
		}
		return semesters;
	};

	/**
	 * Retrieves the current and next semester, considering the graduation year.
	 *
	 * @param {number} gradYear - The graduation year.
	 * @returns {Array} An array containing the current and next semester.
	 */
	const getCurrentAndNextSemester = gradYear => {
		const graduationSemester = encodeSemester("summer", gradYear);
		const current = getCurrentSemester();
		const currentEncoded = encodeSemester(current.term, current.year);
		const nextEncoded = currentEncoded + 1;

		const result = [];

		if (currentEncoded <= graduationSemester) {
			result.push(current);
		}

		if (nextEncoded <= graduationSemester) {
			result.push(decodeSemester(nextEncoded));
		}

		return result;
	};

	/**
	 * Generates an array of future semesters from the current semester to the graduation semester.
	 *
	 * @param {number} gradYear - The graduation year.
	 * @returns {Array} An array containing the current and next semester.
	 */
	const generateFutureSemesters = gradYear => {
		const graduationSemester = encodeSemester("summer", gradYear);
		const current = getCurrentSemester();
		const currentEncoded = encodeSemester(current.term, current.year);
		const nextEncoded = currentEncoded + 1;

		const result = [];

		if (currentEncoded <= graduationSemester) {
			result.push(current);
		}

		if (nextEncoded <= graduationSemester) {
			result.push(decodeSemester(nextEncoded));
		}

		return result;
	};

	/**
	 * Checks if a specific semester is in the list of semesters up until now.
	 *
	 * @param {Array} semestersTillNow - Array of semesters up to the current time.
	 * @param {number} year - The year to check.
	 * @param {string} term - The term (e.g., "spring", "fall", etc.) to check.
	 * @returns {boolean} True if the semester exists in the list, otherwise false.
	 */
	const containsSemester = (semestersTillNow, year, term) => {
		return semestersTillNow.some(semester => semester.year === year && semester.term === term);
	};
	return {
		encodeSemester,
		decodeSemester,
		generateSemesters,
		getCurrentSemester,
		generateSemestersTillNow,
		containsSemester,
		getCurrentAndNextSemester
	};
};

export default useSemesterInfo;
