const generateSemesters = (enrolledYear, gradYear) => {
	const semesters = [];
	semesters.push({ term: "fall", year: enrolledYear });
	for (let year = enrolledYear + 1; year < gradYear; year++) {
		semesters.push({ term: "spring", year });
		semesters.push({ term: "fall", year });
	}
	semesters.push({ term: "spring", year: gradYear });

	return semesters;
};

const getCurrentSemester = () => {
	const date = new Date();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	const term = month >= 9 ? "fall" : "spring";
	return { term, year };
};

const generateSemestersTillNow = startYear => {
	const semesters = [];
	const currentSemester = getCurrentSemester();
	let year = startYear;
	let term = "fall";

	while (year <= currentSemester.year) {
		semesters.push({ term, year });
		if (year === currentSemester.year && term === currentSemester.term) break;
		if (term === "fall") {
			term = "spring";
			year++;
		} else {
			term = "fall";
		}
	}
	// semesters.push(currentSemester);
	return semesters;
};

const containsSemester = (semestersTillNow, year, term) => {
	return semestersTillNow.some(semester => semester.year === year && semester.term === term);
};
export { generateSemesters, generateSemestersTillNow, containsSemester };
