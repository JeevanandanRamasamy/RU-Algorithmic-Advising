import React from "react";

/**
 * The `VerticalCourseListContainer` component displays a list of courses
 * in a vertical layout with a search bar at the top to filter courses based on their name.
 * It allows for customization through various props, including excluding specific courses
 * and passing a custom course component to render the list.
 */
const VerticalCourseListContainer = ({
	title = "",
	searchQuery = "",
	setSearchQuery,
	courses = [],
	excludedCourseIds = [],
	getCourse = course => course,
	CourseComponent,
	courseComponentProps
}) => {
	const filteredCourses = courses
		? courses.filter(
				course =>
					!excludedCourseIds.includes(getCourse(course).course_id) &&
					getCourse(course).course_name.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: [];

	return (
		<section className="flex-1 bg-white rounded-lg shadow-md p-5 h-[600px] flex flex-col">
			<h2>{title}</h2>
			<div className="mb-4">
				<input
					className="w-full p-[10px] border border-gray-300 rounded text-sm box-border"
					type="text"
					id="search-courses"
					placeholder="Search courses"
					value={searchQuery}
					onChange={e => {
						setSearchQuery(e.target.value);
					}}
				/>
			</div>
			<CourseComponent
				courses={filteredCourses}
				getCourse={getCourse}
				{...courseComponentProps}
			/>
		</section>
	);
};

export default VerticalCourseListContainer;
