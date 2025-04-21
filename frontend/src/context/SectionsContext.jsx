import React, { createContext, useContext, useState } from "react";
import isEqual from "lodash/isEqual";
import { showInfoToast, showErrorToast } from "../components/toast/Toast";
import { useAuth } from "../context/AuthContext";

const SectionsContext = createContext();

export const useSections = () => useContext(SectionsContext);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const SectionsProvider = ({ children }) => {
	const { token } = useAuth();
	const [searchedCourses, setSearchedCourses] = useState({});
	const [selectedCourses, setSelectedCourses] = useState({});
	const [checkedSections, setCheckedSections] = useState({});
	const [indexToMeetingTimesMap, setIndexToMeetingTimesMap] = useState({});

	const validSemesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];

	const getSemesterNumber = (term, year) => {
		if (term === "spring") return "1" + year;
		if (term === "fall") return "9" + year;
		if (term === "winter") return "0" + year;
		if (term === "summer") return "7" + year;
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
		const prevIndexToMeetingMap = {};
		await Promise.all(
			courseIds.map(async courseId => {
				const sectionResponse = await fetch(
					`${backendUrl}/api/sections/expanded?course_id=${courseId}&term=${term}&year=${year}`
				);
				const sectionData = await sectionResponse.json();
				const courseSections = sectionData?.sections?.sections || [];
				Object.values(courseSections).forEach(section => {
					const sectionIndex = section.index;
					const meetingTimes = section.meeting_times || [];
					prevIndexToMeetingMap[sectionIndex] = meetingTimes;
				});
				allSections[courseId] = sectionData.sections;
			})
		);
		setSelectedCourses(prev => (isEqual(prev, allSections) ? prev : allSections));
		setIndexToMeetingTimesMap(prev =>
			isEqual(prev, prevIndexToMeetingMap) ? prev : prevIndexToMeetingMap
		);
	};

	const courseAvailableThisSemester = async (courseId, term, year) => {
		if (!validSemesters.some(sem => sem.term === term && sem.year === year)) {
			return true;
		}

		showInfoToast(`Processing ${courseId}`, `checking-${courseId}-${term}-${year}`);
		const sectionResponse = await fetch(
			`${backendUrl}/api/sections?course_id=${courseId}&term=${term}&year=${year}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			}
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
				`${backendUrl}/api/sections/subject?subject=${subject}&term=${term}&year=${year}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				}
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

	const generateValidSchedules = async () => {
		try {
			const serializableCheckedSections = Object.fromEntries(
				Object.entries(checkedSections).map(([courseId, sectionSet]) => [
					courseId,
					Array.from(sectionSet)
				])
			);
			const sectionResponse = await fetch(`${backendUrl}/api/sections/generate_schedules`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					checkedSections: serializableCheckedSections,
					indexToMeetingTimesMap: indexToMeetingTimesMap
				})
			});
			const data = await sectionResponse.json();
			console.log(data);
		} catch (error) {
			console.error("Error fetching sections:", error);
			showErrorToast("Failed to fetch sections.");
		}
	};

	const value = {
		getSemesterNumber,
		fetchSectionsByCourse,
		fetchSectionsByCourses,
		courseAvailableThisSemester,
		fetchSectionsBySubject,
		searchedCourses,
		setSearchedCourses,
		selectedCourses,
		setSelectedCourses,
		checkedSections,
		setCheckedSections,
		indexToMeetingTimesMap,
		setIndexToMeetingTimesMap,
		generateValidSchedules
	};

	return <SectionsContext.Provider value={value}>{children}</SectionsContext.Provider>;
};
