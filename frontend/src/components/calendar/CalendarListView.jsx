import React from "react";
import { useSections } from "../../context/SectionsContext";

const CalendarListView = ({ schedules, index }) => {
	const { indexToCourseMapRef } = useSections();

	const days = { M: "Monday", T: "Tuesday", W: "Wednesday", TH: "Thursday", F: "Fri" };
	return (
		<>
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
