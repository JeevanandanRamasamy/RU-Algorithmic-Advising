import React, { useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useSections = (courseIds, term, year) => {
	const fetchSections = async (courseId, term, year) => {
		console.log(courseId);
		if (courseId && year && term) {
			try {
				const sectionResponse = await fetch(
					`${backendUrl}/api/sections?course_id=${courseId}&semester=${term}&year=${year}`
				);

				const sectionData = await sectionResponse.json();
				console.log(sectionData);

				// if (sectionResponse.ok) {
				// 	const sectionData = await sectionResponse.json();
				// 	if (sectionData.sections) {
				// 		setSections(sectionData.sections); // Update the state with section data
				// 	} else {
				// 		showErrorToast("No sections exist for this course.");
				// 	}
				// } else {
				// 	showErrorToast("Failed to fetch sections.");
				// }
			} catch (error) {
				console.error("Error fetching sections:", error);
				showErrorToast("Failed to fetch sections.");
			}
		}
	};

	const fetchAllSections = async (courseIds, term, year) => {
		if (!Array.isArray(courseIds) || courseIds.length === 0) return;

		try {
			const allResponses = await Promise.all(
				courseIds.map(id => fetchSections(id, term, year))
			);
			console.log("Fetched all section data for courses:", allResponses);
		} catch (err) {
			console.error("Error fetching all sections:", err);
			showErrorToast("Failed to fetch all sections.");
		}
	};

	useEffect(() => {
		fetchAllSections(courseIds, term, year);
	}, [courseIds, term, year]);
	return { fetchSections };
};
