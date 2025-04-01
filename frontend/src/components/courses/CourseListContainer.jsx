import React from "react";

const CourseListContainer = ({
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
		<section className="flex-1 bg-white rounded-lg shadow-md p-5 h-[400px] flex flex-col">
			<h2 className="m-0 p-2 text-center">{title}</h2>
			<div className="mb-4">
				<input
					className="w-full p-[10px] border border-gray-300 rounded text-sm box-border non-draggable"
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

			{/* <CourseList
				courses={filteredCourses}
				CourseItemComponent={courseItemComponent}
				courseItemProps={courseItemProps}
			/> */}
		</section>
	);
};

export default CourseListContainer;
