import React from "react";
import { useSections } from "../../context/SectionsContext";
/**
 * CalendarListView displays a list view of scheduled courses
 * with detailed information like section, instructor, meeting times, etc.
 *
 * Props:
 * - schedules: An object where each key is a schedule index and value is a list of course indices
 * - index: The current schedule index to display
 * - hasView: Boolean to determine if view toggle (Calendar/List) should be shown
 * - view: Current active view mode
 * - setView: Function to change the view mode
 */

const CalendarListView = ({ schedules, index, hasView, view, setView }) => {
	const { indexToCourseMapRef } = useSections();

	const days = { M: "Monday", T: "Tuesday", W: "Wednesday", TH: "Thursday", F: "Fri" };
	return (
		<>
			{hasView && (
				<div className="text-center flex space-x-2 items-center">
					<a
						onClick={() => setView("calendar")}
						className={`underline cursor-pointer ${
							view === "calendar" ? "text-gray-600" : "text-blue-600"
						}`}>
						Calendar View
					</a>
					<span className="text-black"> | </span>
					<a
						onClick={() => setView("list")}
						className={`underline cursor-pointer ${
							view === "list" ? "text-gray-600" : "text-blue-600"
						}`}>
						List View
					</a>
				</div>
			)}
			<div className="pt-2 grid grid-cols-32 font-bold border-b pb-2 border-gray-300">
				<span className="col-span-8">Course Name</span>
				<span className="col-span-2">Section</span>
				<span className="col-span-2">Status</span>
				<span className="col-span-2">Index</span>
				<span className="col-span-8">Meeting Times Locations</span>
				<span className="col-span-3">Exam Code</span>
				<span className="col-span-3">Synopsis</span>
				<span className="col-span-4">Instructor</span>
			</div>

			{Object.values(schedules[index] || {}).map((item, i) => {
				const courseData = indexToCourseMapRef.current[item];
				if (!courseData) return null;

				return (
					<div
						key={`course-${i}`}
						className="grid grid-cols-32 py-2 border-b border-gray-300">
						<span className="col-span-8">{courseData.course_name}</span>
						<span className="col-span-2">{courseData.section_number}</span>
						<span className="col-span-2">{String(courseData.open_status)}</span>
						<span className="col-span-2">{courseData.index}</span>
						<span className="col-span-8">
							<div>
								{courseData.meeting_times?.map(
									({ formatted_time, day, campus, building, room }, index) => (
										<li key={index}>
											{days[day]} {formatted_time} | {campus} {building}
											{room ? `-${room}` : ""}
										</li>
									)
								)}
							</div>
						</span>
						<span className="col-span-3">{courseData.exam_code}</span>
						<span className="col-span-3">
							{courseData?.course_link ? (
								<a
									href={courseData.course_link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline">
									Link
								</a>
							) : null}
						</span>
						<span className="col-span-4">{courseData.instructors.join(", ")}</span>
					</div>
				);
			})}
		</>
	);
};
export default CalendarListView;
