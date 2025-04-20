import React, { useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { showInfoToast, showErrorToast } from "../components/toast/Toast";
import { useCourseRecords } from "../context/CourseRecordsContext";
import isEqual from "lodash/isEqual";

export const useSections = () => {
	const [searchedCourses, setSearchedCourses] = useState({});
	const [selectedCourses, setSelectedCourses] = useState({});
	const [checkedSections, setCheckedSections] = useState({});

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
		return sectionData.sections;
	};

	const fetchSectionsByCourses = async (courseIds, term, year) => {
		const allSections = {};

		await Promise.all(
			courseIds.map(async courseId => {
				const sectionResponse = await fetch(
					`${backendUrl}/api/sections/expanded?course_id=${courseId}&term=${term}&year=${year}`
				);
				const sectionData = await sectionResponse.json();
				allSections[courseId] = sectionData.sections;
			})
		);
		setSelectedCourses(prev => (isEqual(prev, allSections) ? prev : allSections));
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

		const sectionData = await sectionResponse.json();
		if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
			return false;
		}

		return true;
	};

	const fetchSectionsBySubject = async (subject, term, year) => {
		if (subject === "") {
			setSearchedCourses({});
			return;
		}
		try {
			const sectionResponse = await fetch(
				`${backendUrl}/api/sections/subject?subject=${subject}&semester=${term}&year=${year}`
			);
			const sectionData = await sectionResponse.json();
			setSearchedCourses(sectionData.sections || {});
			if (sectionData.error === "No courses exist") {
				showErrorToast(`No courses found`, "courses-not-found");
			}
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
		searchedCourses,
		setSearchedCourses,
		selectedCourses,
		setSelectedCourses,
		checkedSections,
		setCheckedSections,
		fetchSectionsByCourses
	};
};

export default useSections;
