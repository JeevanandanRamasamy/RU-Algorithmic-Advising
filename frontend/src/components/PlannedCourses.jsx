import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import PlannedCourseItem from "./PlannedCourseItem";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PlannedCourses = ({ plannedCourses, onRemoveCourse, onDropCourse }) => {
	const [detailedCourses, setDetailedCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch detailed course information for each planned course if plannedCourses is not empty
	useEffect(() => {
		if (plannedCourses.length === 0) {
			// No courses planned, no need to fetch anything
			setDetailedCourses([]);
			setLoading(false);
			return;
		}

		const fetchCourseDetails = async () => {
			const fetchedCourses = await Promise.all(
				plannedCourses.map(async plannedCourse => {
					try {
						const response = await fetch(
							`${backendUrl}/api/db_courses/id?id=${encodeURIComponent(
								plannedCourse.course_id
							)}`
						);
						if (response.ok) {
							const data = await response.json();
							return data.course; // Assuming the API returns a course object
						} else {
							const errorData = await response.json();
							console.error("Error:", errorData.message);
							setError(errorData.message);
							return null;
						}
					} catch (error) {
						console.error("Error fetching course details:", error);
						setError("An unexpected error occurred while fetching course details.");
						return null;
					}
				})
			);
			setDetailedCourses(fetchedCourses.filter(course => course !== null));
			setLoading(false);
		};

		fetchCourseDetails();
	}, [plannedCourses]); // Only re-run when plannedCourses changes
	console.log(detailedCourses);

	// Drag-and-drop functionality using react-dnd
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "COURSE",
		drop: item => {
			//console.log("Dropped course:", item);
			onDropCourse(item.id); // Pass courseId
		},
		collect: monitor => ({
			isOver: !!monitor.isOver()
		})
	}));

	const handleRemoveCourse = courseId => {
		//console.log("Removing course with ID:", courseId);
		onRemoveCourse(courseId);
	};

	return (
		<div
			ref={drop}
			className={`planned-courses-container ${isOver ? "drag-over" : ""}`}>
			{loading ? (
				<div>Loading planned courses...</div>
			) : error ? (
				<div className="error-message">{error}</div>
			) : (
				<>
					{detailedCourses.length > 0 ? (
						<div className="planned-courses-list">
							{detailedCourses.map(course => (
								<PlannedCourseItem
									key={course.course_id}
									plannedCourse={course}
									onRemove={handleRemoveCourse}
								/>
							))}
						</div>
					) : (
						<div className="no-courses-message">
							No courses planned. Drag and drop to add courses.
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default PlannedCourses;
