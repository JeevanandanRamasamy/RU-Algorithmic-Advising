import CourseList from "./CourseList";
import CourseItem from "./CourseItem";

/**
 * Component for displaying a list of available courses with the option to show filters
 * and manage the course list according to specified limits and requirements.
 */
export const AvailableCourses = ({
	courses,
	getCourse,
	limit,
	showFilters,
	requirementStrings
}) => {
	console.log(courses);
	return (
		<div
			className={`p-2 overflow-y-scroll border border-gray-200 rounded-md ${
				showFilters ? "h-[600px]" : "h-[726.4px]"
			}`}>
			<CourseList
				courses={courses}
				getCourse={getCourse}
				CourseItemComponent={CourseItem}
				requirementStrings={requirementStrings}
				limit={limit}
			/>
		</div>
	);
};

export default AvailableCourses;
