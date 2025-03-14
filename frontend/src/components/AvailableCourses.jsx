import React, { useState, useEffect, useCallback } from "react";
import "../css/DragDrop.css";
import CourseList from "../components/CourseList";

const AvailableCourses = ({ courses }) => {
	const [searchAvailable, setSearchAvailable] = useState("");
	const [filteredCourses, setFilteredCourses] = useState("");

	useEffect(() => {
		const filteredCourses = searchAvailable
			? courses.filter(course =>
					course.course_name.toLowerCase().includes(searchAvailable.toLowerCase())
			  )
			: courses;

		setFilteredCourses(filteredCourses);
	}, [searchAvailable, courses]);

	return (
		<section className="available-courses">
			<h2>Available Courses</h2>
			<div className="search-container">
				<input
					type="text"
					id="search-courses"
					placeholder="Search courses"
					value={searchAvailable}
					onChange={e => {
						setSearchAvailable(e.target.value);
					}}
				/>
			</div>
			<CourseList courses={filteredCourses} />
		</section>
	);
};

export default AvailableCourses;
