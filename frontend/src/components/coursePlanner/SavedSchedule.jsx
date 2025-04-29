import React from "react";
import { useSections } from "../../context/SectionsContext";
import CalendarLegend from "../calendar/CalendarLegend";
import ScheduleCalendar from "../calendar/ScheduleCalendar";
import OnlineCourses from "../calendar/OnlineCourses";
import Button from "../generic/Button";
import { useEffect } from "react";
import ListItemWithLink from "../generic/ListItemWithLink";

const SavedSchedule = ({ term, year }) => {
	const {
		savedSchedulesMap,
		selectedScheduleName,
		setSelectedScheduleName,
		savedAsyncCourses,
		savedScheduleNames,
		deleteSchedule,
		fetchSavedSchedules
	} = useSections();
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
	//TODO: handle remove schedule
	console.log(savedSchedulesMap[`${term}-${year}`] || {});
	console.log(selectedScheduleName);
	return (
		<>
			<CalendarLegend />

			<div className="flex gap-4">
				<div className="w-[20%]  p-2 border border-gray-200 rounded-md bg-white flex flex-col">
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
					<ScheduleCalendar
						map={savedSchedulesMap[`${term}-${year}`] || {}}
						index={selectedScheduleName}
					/>
					<OnlineCourses
						asyncCourses={savedAsyncCourses[`${term}-${year}`] || {}}
						index={selectedScheduleName}
					/>
				</div>
			</div>
		</>
	);
};

export default SavedSchedule;
