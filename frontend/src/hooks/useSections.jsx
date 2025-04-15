import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { showInfoToast } from "../components/toast/Toast";

export const useSections = () => {
	const [searchedSections, setSearchedSections] = useState({});
	const [selectedSections, setSelectedSections] = useState({});

	const validSemesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];
	const getSemesterNumber = (term, year) => {
		if (term === "spring") {
			return "1" + year;
		} else if (term === "fall") {
			return "9" + year;
		} else if (term === "winter") {
			return "0" + year;
		} else if (term === "summer") {
			return "7" + year;
		}
	};
	const fetchSectionsByCourse = async (courseId, term, year) => {
		const sectionResponse = await fetch(
			`${backendUrl}/api/sections?course_id=${courseId}&term=${term}&year=${year}`
		);
		const sectionData = await sectionResponse.json();
		console.log(sectionData);
	};

	const courseAvailableThisSemester = async (courseId, term, year) => {
		if (!validSemesters.some(sem => sem.term === term && sem.year === year)) {
			return true;
		}

		showInfoToast(`Processing ${courseId}`, `checking-${courseId}-${term}-${year}`);
		const sectionResponse = await fetch(
			`${backendUrl}/api/sections?course_id=${courseId}&term=${term}&year=${year}`
		);

		if (!sectionResponse.ok) {
			console.error("Error fetching sections:", sectionResponse.status);
			return false;
		}
		console.log(!sectionResponse.ok);

		const sectionData = await sectionResponse.json();
		console.log(sectionData);
		if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
			return false;
		}

		return true;
	};

	const fetchSectionsBySubject = async (subject, term, year) => {
		console.log(subject);
		if (subject === "") {
			setCurrentSections({});
			return;
		}
		try {
			console.log(subject);
			const sectionResponse = await fetch(
				`${backendUrl}/api/sections/subject?subject=${subject}&semester=${term}&year=${year}`
			);
			const sectionData = await sectionResponse.json();
			setCurrentSections(sectionData.sections || {});
			console.log(sectionData);
		} catch (error) {
			console.error("Error fetching sections:", error);
			showErrorToast("Failed to fetch sections.");
		}
	};

	return {
		fetchSectionsBySubject,
		getSemesterNumber,
		fetchSectionsByCourse,
		courseAvailableThisSemester,
		searchedSections,
		setSearchedSections,
		selectedSections,
		setSelectedSections
	};
};

export default useSections;
