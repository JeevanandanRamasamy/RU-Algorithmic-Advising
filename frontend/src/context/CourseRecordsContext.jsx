import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { showErrorToast, showInfoToast, clearToast } from "../components/toast/Toast";
import { useCourseRequirements } from "./CourseRequirementContext";
import { useSections } from "../context/SectionsContext";
import isEqual from "lodash/isEqual";
import { useStudentDetails } from "../context/StudentDetailsContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const CourseRecordsContext = createContext();

export const CourseRecordsProvider = ({ children }) => {
	const { fetchPlannedCoursesWithMissingRequirements } = useCourseRequirements();
	const { courseOfferedThisSemester } = useSections();
	const { token } = useAuth();
	const [courseRecords, setCourseRecords] = useState([]);
	const [coursesRecordsLoading, setCoursesRecordsLoading] = useState(false);
	const [coursesRecordsError, setCourseRecordsError] = useState(null);
	const courseRecordsRef = useRef(courseRecords);
	const { courseAvailableThisSemester } = useSections();
	const [plannedCourses, setPlannedCourses] = useState([]);
	const { fetchUserDetails } = useStudentDetails();

	const fetchPlannedCourses = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/users/course_record/planned`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();

			setPlannedCourses(prev =>
				isEqual(prev, data.planned_courses ?? []) ? prev : data.planned_courses ?? []
			);
		} catch (err) {
			console.error("Error fetching courses:", err);
		}
	};
	useEffect(() => {
		if (token) {
			fetchPlannedCourses();
		}
	}, [courseRecords]);

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
		const isAvailable = await courseAvailableThisSemester(courseId, term, year);
		clearToast(`checking-${courseId}-${term}-${year}`);
		if (!isAvailable) {
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
				fetchUserDetails();
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
				fetchUserDetails();
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
				plannedCourses,
				setPlannedCourses,
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

export const useCourseRecords = () => useContext(CourseRecordsContext);
