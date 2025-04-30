import React from "react";
import { useSections } from "../../context/SectionsContext";
import CalendarLegend from "../calendar/CalendarLegend";
import ScheduleCalendar from "../calendar/ScheduleCalendar";
import OnlineCourses from "../calendar/OnlineCourses";
import { useEffect, useState } from "react";
import ListItemWithLink from "../generic/ListItemWithLink";
import CalendarListView from "../calendar/CalendarListView";

/**
 * Component to display saved course schedules for a given term and year.
 * Allows users to view saved schedules in both list and calendar formats,
 * select a schedule, and delete existing schedules.
 */
const SavedSchedule = ({ term, year }) => {
	const {
		savedSchedulesMap,
		selectedScheduleName,
		setSelectedScheduleName,
		savedAsyncCourses,
		savedScheduleNames,
		deleteSchedule
	} = useSections();
	const [view, setView] = useState("calendar");

	useEffect(() => {
		if (
			term &&
			year &&
			savedScheduleNames[`${term}-${year}`] &&
			Object.values(savedScheduleNames[`${term}-${year}`])?.length > 0
		) {
			setSelectedScheduleName(savedScheduleNames[`${term}-${year}`][0] || "");
		}
	}, [term, year, savedScheduleNames]);
	return (
		<>
			<CalendarLegend />
			<div className="flex gap-4">
				<div className="w-[20%] h-[600px] p-2 border border-gray-200 rounded-md bg-white flex flex-col">
					<h2 className="m-0 text-center">Saved Schedules</h2>
					<div className="overflow-y-auto flex-1 p-2 border border-gray-200 rounded-2xl">
						{savedScheduleNames &&
							`${term}-${year}` in savedScheduleNames &&
							savedScheduleNames[`${term}-${year}`].map(scheduleName => (
								<ListItemWithLink
									key={scheduleName}
									id={scheduleName}
									value={scheduleName}
									isSelected={scheduleName == selectedScheduleName}
									linkOnClick={() => setSelectedScheduleName(scheduleName)}
									onClick={() => deleteSchedule(term, year, scheduleName)}
									buttonType="-"
								/>
							))}
					</div>
				</div>
				<div className="w-[80%]">
					{view === "list" && (
						<>
							{(() => {
								const semester = `${term}-${year}`;
								const scheduleEntries =
									savedSchedulesMap[semester]?.[selectedScheduleName] || [];
								const asyncEntries =
									savedAsyncCourses[semester]?.[selectedScheduleName] || [];

								const combinedIndexes = Array.from(
									new Set([
										...scheduleEntries.map(e => e.index),
										...asyncEntries.map(e => e.index)
									])
								);

								return (
									<CalendarListView
										schedules={{ [selectedScheduleName]: combinedIndexes }}
										index={selectedScheduleName}
										hasView
										view={view}
										setView={setView}
									/>
								);
							})()}
						</>
					)}
					{view === "calendar" && (
						<>
							<ScheduleCalendar
								map={savedSchedulesMap[`${term}-${year}`] || {}}
								index={selectedScheduleName}
								hasView={true}
								view={view}
								setView={setView}
							/>
							<OnlineCourses
								asyncCourses={savedAsyncCourses[`${term}-${year}`] || {}}
								index={selectedScheduleName}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default SavedSchedule;
