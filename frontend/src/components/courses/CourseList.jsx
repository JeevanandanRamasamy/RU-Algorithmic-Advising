import React from "react";

const CourseList = ({ courses, getCourse, CourseItemComponent, courseItemProps }) => {
	return (
		<div className="flex-1 overflow-y-auto border border-gray-200 rounded p-2">
			{courses?.length > 0 ? (
				<>
					{(() => {
						const items = [];
						for (let i = 0; i < Math.min(50, courses.length); i++) {
							items.push(
								<CourseItemComponent
									key={getCourse(courses[i]).course_id}
									course={getCourse(courses[i])}
									{...courseItemProps}
								/>
							);
						}
						return items;
					})()}
				</>
			) : (
				<div className="no-courses">No available courses found</div>
			)}
		</div>
	);
};

export default CourseList;
