import React from "react";

const CourseList = ({
	courses = [],
	getCourse,
	CourseItemComponent,
	courseItemProps,
	isHorizontal = false
}) => {
	return (
		// <div className="overflow-y-auto rounded p-2">
		<>
			{courses.slice(0, 50).map(course => (
				<CourseItemComponent
					key={getCourse(course).course_id}
					course={getCourse(course)}
					{...courseItemProps}
				/>
			))}
		</>
		// </div>
		// ) : (
		// 	<div className="flex-1 overflow-y-auto border border-gray-200 rounded p-2"> </div>
		// 	// <div className="no-courses">No available courses found</div>
		// )}
		// </div>
	);
};

export default CourseList;
