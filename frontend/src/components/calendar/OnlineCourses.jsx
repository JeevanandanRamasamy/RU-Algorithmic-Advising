import React from "react";
import { useSections } from "../../context/SectionsContext";
import { useCourseRecords } from "../../context/CourseRecordsContext";

const OnlineCourses = ({ asyncCourses, index, map }) => {
	// const { asyncCourses, scheduleIndex } = useSections();
	// console.log(asyncCourses, Object.keys(asyncCourses).length, !(index in asyncCourses));
	if (
		!asyncCourses ||
		Object.keys(asyncCourses).length === 0 ||
		!(index in asyncCourses) ||
		Object.keys(map).length === 0 ||
		asyncCourses[index].length === 0
	) {
		return null;
	}
	console.log(asyncCourses);
	// console.log(asyncCourses, index);

	return (
		<>
			{/* {!(
				(Object.keys(asyncCourses).length === 1) */}
			{/* // &&
				// Array.isArray(asyncCourses[0]) &&
				// asyncCourses[0].length === 0 */}
			{/* ) && ( */}
			<>
				<div className="pt-2">BY ARRANGEMENT COURSES:</div>
				<div className="pt-2 grid grid-cols-5 font-bold border-b pb-2 border-gray-300">
					<span>Course Name</span>
					<span>Course ID</span>
					<span>Section</span>
					<span>Index</span>
					<span>Status</span>
				</div>

				{/* Data rows */}
				{Object.values(asyncCourses[index]).map((item, i) => (
					<div
						key={i}
						className="grid grid-cols-5 py-2 border-b border-gray-300">
						<span>{item.course_name}</span>
						<span>{item.course_id}</span>
						<span>{item.section_number}</span>
						<span>{item.index}</span>
						<span>{String(item.open_status)}</span>
					</div>
				))}
			</>
		</>
	);
};

export default OnlineCourses;
