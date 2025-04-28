import React from "react";
import { useSections } from "../../context/SectionsContext";
import ScheduleCalendar from "../calendar/ScheduleCalendar";
import CalendarLegend from "../calendar/CalendarLegend";
import OnlineCourses from "../calendar/OnlineCourses";
import Button from "../generic/Button";

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

	const handleNext = () => {
		if (scheduleIndex < Object.keys(schedulesMap).length - 1) {
			setScheduleIndex(scheduleIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (scheduleIndex > 0) {
			setScheduleIndex(scheduleIndex - 1);
		}
	};
	return (
		<>
			<div className="pb-2 flex justify-end gap-2">
				{!(
					Object.keys(schedulesMap).length === 1 &&
					Array.isArray(schedulesMap[0]) &&
					schedulesMap[0].length === 0
				) && (
					<>
						{scheduleIndex != 0 && (
							<Button
								onClick={handlePrevious}
								className="p-2 w-[72px] flex items-center justify-center rounded bg-blue-500 text-white  border border-black"
								label="Previous"
							/>
						)}
						<div className="text-center flex items-center">
							{Object.keys(schedulesMap).length === 0
								? "0 of 0"
								: `${scheduleIndex + 1} of ${Object.keys(schedulesMap).length}`}
						</div>
						<Button
							onClick={handleNext}
							className={`p-2 w-[72px] flex items-center justify-center rounded bg-blue-500 text-white border border-black ${
								scheduleIndex === Object.keys(schedulesMap).length - 1
									? "invisible"
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
			<CalendarLegend />
			<ScheduleCalendar
				map={schedulesMap}
				index={scheduleIndex}
			/>
			<OnlineCourses
				map={schedulesMap}
				asyncCourses={asyncCourses}
				index={scheduleIndex}
			/>
		</>
	);
};

export default BuildSchedule;
