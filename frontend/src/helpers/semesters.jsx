const encodeSemester = (term, year) => {
	const termOffset = {
		winter: 0,
		spring: 1,
		summer: 2,
		fall: 3
	};
	return year * 4 + termOffset[term];
};

const decodeSemester = encoded => {
	const terms = ["winter", "spring", "summer", "fall"];
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
	const date = new Date();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	const term = month >= 9 ? "fall" : month >= 6 ? "summer" : "spring";
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

const containsSemester = (semestersTillNow, year, term) => {
	return semestersTillNow.some(semester => semester.year === year && semester.term === term);
};
export {
	encodeSemester,
	decodeSemester,
	generateSemesters,
	getCurrentSemester,
	generateSemestersTillNow,
	containsSemester
};
