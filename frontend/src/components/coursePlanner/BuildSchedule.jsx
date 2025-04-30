import React from "react";
import { useSections } from "../../context/SectionsContext";
import ScheduleCalendar from "../calendar/ScheduleCalendar";
import CalendarLegend from "../calendar/CalendarLegend";
import OnlineCourses from "../calendar/OnlineCourses";
import Button from "../generic/Button";
import { useState } from "react";
import CalendarListView from "../calendar/CalendarListView";

/**
 * Component for building and managing course schedules.
 * Allows users to toggle between calendar and list views,
 * navigate between generated schedule options, name a schedule,
 * and save the selected schedule.
 */
const BuildSchedule = ({ term, year }) => {
	const {
		saveSchedule,
		scheduleName,
		setScheduleName,
		scheduleIndex,
		setScheduleIndex,
		schedulesMap,
		asyncCourses
	} = useSections();
	const [view, setView] = useState("calendar");
	const { validSchedules } = useSections();

	// Advances to the next schedule in the list
	const handleNext = () => {
		if (scheduleIndex < Object.keys(schedulesMap).length - 1) {
			setScheduleIndex(scheduleIndex + 1);
		}
	};

	// Goes back to the previous schedule in the list
	const handlePrevious = () => {
		if (scheduleIndex > 0) {
			setScheduleIndex(scheduleIndex - 1);
		}
	};
	return (
		<>
			<div className="pb-2 flex gap-2">
				{!(
					Object.keys(schedulesMap).length === 1 &&
					Array.isArray(schedulesMap[0]) &&
					schedulesMap[0].length === 0
				) && (
					<>
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
							<span className="text-black"> | </span>
						</div>
						<Button
							onClick={handlePrevious}
							className={`p-2 w-[72px] flex items-center justify-center rounded bg-blue-500 text-white border border-black ${
								scheduleIndex === 0 ? "opacity-0 pointer-events-none" : ""
							}`}
							label="Previous"
						/>
						<div className="text-center flex items-center">
							{Object.keys(schedulesMap).length === 0
								? "0 of 0"
								: `${scheduleIndex + 1} of ${Object.keys(schedulesMap).length}`}
						</div>
						<Button
							onClick={handleNext}
							className={`p-2 w-[72px] flex items-center justify-center rounded bg-blue-500 text-white border border-black ${
								scheduleIndex === Object.keys(schedulesMap).length - 1
									? "opacity-0 pointer-events-none"
									: ""
							}`}
							label="Next"
						/>
					</>
				)}
				<input
					type="text"
					value={scheduleName}
					onChange={e => setScheduleName(e.target.value)}
					placeholder="Enter schedule name"
					className="w-[400px] border border-gray-300 p-2 rounded"
				/>
				<Button
					onClick={() => saveSchedule(term, year)}
					className="p-2 flex items-center justify-center rounded bg-blue-500 text-white  border border-black"
					label="Save Schedule"
				/>
			</div>
			{view === "list" && (
				<>
					<CalendarListView
						schedules={validSchedules}
						index={scheduleIndex}
					/>
				</>
			)}
			{view === "calendar" && (
				<>
					<CalendarLegend />
					<ScheduleCalendar
						map={schedulesMap}
						index={scheduleIndex}
						view={view}
						setView={setView}
						hasView={false}
					/>
					<OnlineCourses
						map={schedulesMap}
						asyncCourses={asyncCourses}
						index={scheduleIndex}
					/>
				</>
			)}
		</>
	);
};

export default BuildSchedule;
