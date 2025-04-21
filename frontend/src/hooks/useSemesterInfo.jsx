import React from "react";

const useSemesterInfo = () => {
	const encodeSemester = (term, year) => {
		const termOffset = {
			spring: 0,
			summer: 1,
			fall: 2,
			winter: 3
		};
		return year * 4 + termOffset[term];
	};

	const decodeSemester = encoded => {
		const terms = ["spring", "summer", "fall", "winter"];
		const year = Math.floor(encoded / 4);
		const term = terms[encoded % 4];
		return { term, year };
	};

	const generateSemesters = (enrollYear, gradYear) => {
		const semesters = [];
		const startEncoded = encodeSemester("fall", enrollYear);
		const endEncoded = encodeSemester("summer", gradYear);
		for (let encoded = startEncoded; encoded <= endEncoded; encoded++) {
			semesters.push(decodeSemester(encoded));
		}
		return semesters;
	};

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
