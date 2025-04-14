import React, { createContext, useContext, useState, useEffect, useRef } from "react";

import { showInfoToast, clearToast, showSuccessToast } from "../components/toast/Toast";

const SectionsContext = createContext(null);

export const SectionsProvider = ({ children }) => {
	const validSemesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];
	const [sectionsMap, setSectionsMap] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const sectionsMapRef = useRef({});
	const loadingRef = useRef(true);

	const fetchSections = async (term, year) => {
		try {
			const res = await fetch(`/api/sections/all?term=${term}&year=${year}`);
			const data = await res.json();
			return data.courses_with_sections || [];
		} catch (error) {
			console.error(`Error fetching sections for ${term} ${year}:`, error);
			setError(error);
			return [];
		}
	};

	useEffect(() => {
		const loadSections = async () => {
			showInfoToast("loading courses", "loading-sections");
			const resultMap = {};

			for (const semester of validSemesters) {
				const term = semester["term"];
				const year = semester["year"];
				const sections = await fetchSections(term, year);
				resultMap[getSemesterNumber(term, year)] = sections;
			}

			clearToast("loading-sections");
			setSectionsMap(resultMap);
			setLoading(false);
			showSuccessToast("Finished loading courses", "completed-loading-courses");
		};

		loadSections();
	}, []);

	useEffect(() => {
		sectionsMapRef.current = sectionsMap;
	}, [sectionsMap]);

	useEffect(() => {
		loadingRef.current = loading;
	}, [loading]);

	const courseOfferedThisSemester = (term, year, courseId) => {
		let semester = "";

		if (term === "spring") {
			semester = "1" + year;
		} else if (term === "fall") {
			semester = "9" + year;
		} else if (term === "winter") {
			semester = "0" + year;
		} else if (term === "summer") {
			semester = "7" + year;
		}

		if (!(semester in sectionsMapRef.current)) {
			return true;
		}

		if (loadingRef.current) {
			console.log("Still loading courses, please wait...");
			return;
		}

		const course = sectionsMapRef.current[semester]?.[courseId];
		return !!course;
	};

	return (
		<SectionsContext.Provider
			value={{ sectionsMap, courseOfferedThisSemester, loading, error }}>
			{children}
		</SectionsContext.Provider>
	);
};

export const useSections = () => {
	return useContext(SectionsContext);
};
