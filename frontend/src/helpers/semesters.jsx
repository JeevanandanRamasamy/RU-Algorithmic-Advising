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
export { generateSemesters };
