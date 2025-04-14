import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { showErrorToast } from "../components/toast/Toast";
import { useSections } from "./SectionsContext";
import { useCourseRequirements } from "./CourseRequirementContext";

const CourseRecordsContext = createContext();

export const CourseRecordsProvider = ({ children }) => {
	const { fetchPlannedCoursesWithMissingRequirements } = useCourseRequirements();
	const { courseOfferedThisSemester } = useSections();
	const { token } = useAuth();
	const [courseRecords, setCourseRecords] = useState([]);
	const [coursesRecordsLoading, setCoursesRecordsLoading] = useState(false);
	const [coursesRecordsError, setCourseRecordsError] = useState(null);
	const courseRecordsRef = useRef(courseRecords);

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const fetchCourseRecords = useCallback(async () => {
		setCoursesRecordsLoading(true);
		try {
			const res = await fetch(`${backendUrl}/api/users/course_record/terms`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			});
			if (!res.ok) throw new Error("Failed to fetch course records");
			const data = await res.json();
			setCourseRecords(data.course_records || []);
		} catch (err) {
			setCourseRecordsError(err.message);
			console.error("Error fetching course records:", err);
		} finally {
			setCoursesRecordsLoading(false);
		}
	}, [backendUrl]);

	useEffect(() => {
		if (token) fetchCourseRecords();
	}, [token]);

	useEffect(() => {
		courseRecordsRef.current = courseRecords;
	}, [courseRecords]);

	const handleAddCourseRecord = async (courseId, term, year) => {
		if (!courseOfferedThisSemester?.(term, year, courseId)) {
			showErrorToast(
				`${courseId} is not offered ${term} ${year}`,
				`${courseId}-${term}-${year}`
			);
			return;
		}

		const existingCourse = courseRecordsRef.current.find(
			c => c?.course_info?.course_id === courseId
		);
		const method = existingCourse ? "PUT" : "POST";

		try {
			const res = await fetch(`${backendUrl}/api/users/course_record`, {
				method,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ course_id: courseId, term, year })
			});
			const data = await res.json();
			if (!res.ok) {
				setCourseRecordsError(data.message);
			} else {
				setCourseRecords(prev => {
					const index = prev.findIndex(c => c?.course_info?.course_id === courseId);
					if (index !== -1) {
						const updated = [...prev];
						updated[index] = { ...updated[index], term, year };
						return updated;
					}
					return [...prev, data.course_record];
				});
				fetchPlannedCoursesWithMissingRequirements?.();
			}
		} catch (err) {
			setCourseRecordsError(err.message);
			console.error("Error adding course record:", err);
		}
	};

	const handleRemoveCourseRecord = async courseId => {
		setCoursesRecordsLoading(true);
		try {
			const res = await fetch(`${backendUrl}/api/users/course_record`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ course_id: courseId })
			});
			const data = await res.json();
			if (!res.ok) {
				setCourseRecordsError(data.message);
			} else {
				setCourseRecords(prev => prev.filter(c => c.course_info.course_id !== courseId));
				fetchPlannedCoursesWithMissingRequirements?.();
			}
		} catch (err) {
			console.error("Error removing course record:", err);
		} finally {
			setCoursesRecordsLoading(false);
		}
	};

	return (
		<CourseRecordsContext.Provider
			value={{
				courseRecords,
				setCourseRecords,
				coursesRecordsLoading,
				setCoursesRecordsLoading,
				coursesRecordsError,
				setCourseRecordsError,
				handleAddCourseRecord,
				handleRemoveCourseRecord,
				fetchCourseRecords
			}}>
			{children}
		</CourseRecordsContext.Provider>
	);
};

export const useCourseRecordsContext = () => useContext(CourseRecordsContext);
