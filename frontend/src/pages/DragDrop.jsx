import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/navbuttons/LogoutButton";
import HomeButton from "../components/navbuttons/HomeButton";
import useCourses from "../hooks/useCourses";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";

import AvailableCourses from "../components/courses/AvailableCourses";
import PlannedCourses from "../components/courses/PlannedCourses";
import CourseListContainer from "../components/courses/CourseListContainer";
import usePlannedCourses from "../hooks/usePlannedCourses";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function DragDrop() {
	const { user, token, logout } = useAuth();
	const {
		courses,
		coursesLoading,
		coursesError,
		fetchCourses,
		setCourses,
		searchAvailable,
		setSearchAvailable,
		filteredCourses,
		setFilteredCourses,
		excludeCoursesByIds
	} = useCourses(backendUrl, token);
	const {
		plannedCourses,
		plannedCoursesLoading,
		plannedCoursesError,
		planId,
		fetchPlannedCourses,
		setPlannedCourses,
		searchPlannedQuery,
		setSearchPlannedQuery,
		handleAddPlannedCourse,
		handleRemovePlannedCourse
	} = usePlannedCourses(backendUrl, token, courses);

	// TODO: Filter out taken courses
	return (
		<div className="app">
			<Navbar />
			<header className="app-header">
				<h1>Course Planner</h1>
			</header>
			<main className="course-planner">
				<CourseListContainer
					title="Available Courses"
					searchQuery={searchAvailable}
					setSearchQuery={setSearchAvailable}
					courses={courses}
					excludedCourseIds={
						plannedCourses?.length > 0
							? plannedCourses.map(
									plannedCourse => plannedCourse.course_info.course_id
							  )
							: []
					}
					CourseComponent={AvailableCourses}
				/>
				<CourseListContainer
					title="Planned Courses"
					searchQuery={searchPlannedQuery}
					setSearchQuery={setSearchPlannedQuery}
					courses={plannedCourses}
					getCourse={course => course.course_info}
					CourseComponent={PlannedCourses}
					courseComponentProps={{
						loading: plannedCoursesLoading,
						error: plannedCoursesError,
						onRemoveCourse: handleRemovePlannedCourse,
						onAddCourse: handleAddPlannedCourse
					}}
				/>
			</main>
		</div>
	);
}

export default DragDrop;
