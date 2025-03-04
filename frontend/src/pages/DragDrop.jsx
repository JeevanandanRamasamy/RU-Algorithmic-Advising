import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import CourseList from "../components/CourseList";
import PlannedCourses from "../components/PlannedCourses";
import LogoutButton from "../components/navbuttons/LogoutButton";
import HomeButton from "../components/navbuttons/HomeButton";
import "../css/DragDrop.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function DragDrop() {
	const [courses, setCourses] = useState([]);
	const [plannedCourses, setPlannedCourses] = useState([]);
	const [planId, setPlanId] = useState(null); // Add a state to hold plan_id
	const [searchAvailable, setSearchAvailable] = useState("");
	const [loading, setLoading] = useState(true);
	const { user, token, logout } = useAuth();

	useEffect(() => {
		fetchCourses();
		fetchPlannedCourses();
	}, [token]);

	const fetchCourses = useCallback(async (search = "") => {
		setLoading(true);
		try {
			const url = search
				? `${backendUrl}/api/db_courses?search=${encodeURIComponent(search)}`
				: `${backendUrl}/api/db_courses`;

			const response = await fetch(url);
			const data = await response.json();
			// console.log("Fetched Courses:", data);
			setCourses(data);
		} catch (error) {
			console.error("Error fetching courses:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchPlannedCourses = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/planned_courses`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});
			const data = await response.json();
			// console.log("Fetched Planned Courses:", data);
			// console.log("Fetched id: ", data.pland_id)
			setPlanId(data.plan_id);
			setPlannedCourses(data.courses);
		} catch (error) {
			console.error("Error fetching planned courses:", error);
		}
	};
  /*
	useEffect(() => {
		console.log("plan_id: ", planId);
	}, [planId]);*/

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchCourses(searchAvailable);
		}, 300);
		return () => clearTimeout(delayDebounceFn);
	}, [searchAvailable, fetchCourses]);

	const handleSearchAvailable = e => {
		setSearchAvailable(e.target.value);
	};

	const addCourseToPlan = async courseId => {
		setCourses(prevCourses => {
			const courseToAdd = prevCourses.find(course => course.course_id === courseId);
			if (!courseToAdd) {
				console.error("Course not found in available courses!");
				return prevCourses;
			}

			// Optimistically add the course to the planned courses list
			setPlannedCourses(prevPlannedCourses => {
				if (prevPlannedCourses.some(planned => planned.course_id === courseId)) {
					return prevPlannedCourses; // Prevent duplicates
				}
				return [...prevPlannedCourses, courseToAdd];
			});

			return prevCourses; // Return unchanged courses
		});

		try {
			const response = await fetch(`${backendUrl}/api/planned_courses/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ course_id: courseId })
			});

			if (!response.ok) {
				const data = await response.json();
				console.error("Error adding course to the plan:", data.message);
				// In case of an error, remove the optimistically added course
				setPlannedCourses(prevPlannedCourses =>
					prevPlannedCourses.filter(course => course.course_id !== courseId)
				);
			} else {
				//console.log("Course added to the plan");
				// Only update the planId if needed (assuming API gives back plan_id)
				const data = await response.json();
				setPlanId(data.plan_id || planId); // Only update if new plan_id is returned
			}
		} catch (error) {
			console.error("Error adding course:", error);
			// In case of an error, remove the optimistically added course
			setPlannedCourses(prevPlannedCourses =>
				prevPlannedCourses.filter(course => course.course_id !== courseId)
			);
		}
	};

	const dropCourseFromPlan = async courseId => {
		setLoading(true);

		try {
			if (!planId) {
				console.error("Plan ID is missing!");
				return;
			}

			// First, update the UI optimistically
			setPlannedCourses(prevPlannedCourses =>
				prevPlannedCourses.filter(course => course.course_id !== courseId)
			);

			const response = await fetch(`${backendUrl}/api/planned_courses/drop`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					course_id: courseId,
					plan_id: planId
				})
			});

			if (!response.ok) {
				const data = await response.json();
				console.error("Error removing course:", data.message);
				// If there's an error, restore the previous state by re-fetching
				await fetchPlannedCourses();
			} //else {
				//console.log("Course removed successfully");
				// No need to refetch if the operation was successful
			//}
		} catch (error) {
			console.error("Error removing course from the plan:", error);
			// In case of an error, restore the previous state
			await fetchPlannedCourses();
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>Course Planner</h1>
			</header>
			<HomeButton />
			<LogoutButton />
			<main className="course-planner">
				<section className="available-courses">
					<h2>Available Courses</h2>
					<div className="search-container">
						<input
							type="text"
							id="search-courses"
							placeholder="Search courses"
							value={searchAvailable}
							onChange={handleSearchAvailable}
						/>
					</div>
					<CourseList
						courses={courses}
						isPlanned={false}
					/>
				</section>
				<section className="planned-courses">
					<h2>Planned Courses</h2>
					<PlannedCourses
						plannedCourses={plannedCourses}
						onRemoveCourse={dropCourseFromPlan}
						onDropCourse={addCourseToPlan}
					/>
				</section>
			</main>
		</div>
	);
}

export default DragDrop;
