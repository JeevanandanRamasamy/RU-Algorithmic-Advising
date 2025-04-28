import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import React, { useState } from "react";
import "../../css/ScheduleCalendar.css";
import { useSections } from "../../context/SectionsContext";
import CustomEvent from "../calendar/CustomEvent";

const MinimalToolbar = ({ label }) => (
	<div style={{ textAlign: "center", padding: "0.5rem", fontWeight: "bold" }}></div>
);

const ScheduleCalendar = ({ index, map }) => {
	const locales = {
		"en-US": enUS
	};
	console.log(index, map[index], map);

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
		getDay,
		locales
	});
	// const { validSchedules, indexToMeetingTimesMap, scheduleIndex, schedulesMap } = useSections();
	const eventPropGetter = event => ({
		style: {
			minHeight: "30px",
			// backgroundColor: "#3174ad",
			// color: "white",
			fontSize: "0.75rem",
			borderRadius: "5px",
			border: event.open_status === false ? "3px dashed #cc0033" : "none",
			backgroundColor: event.background_color,
			color: event.open_status === false ? "#cc0033" : "black"
		}
		// "data-tooltip-id": `event-tooltip-${event.title}-${event.start}`
	});
	return (
		<div style={{ height: "80vh" }}>
			<Calendar
				localizer={localizer}
				events={map && index in map ? map[index] : []}
				startAccessor="start"
				endAccessor="end"
				defaultView={Views.WORK_WEEK}
				views={[Views.WORK_WEEK, Views.AGENDA]}
				dayPropGetter={date => {
					const day = date.getDay();
					return {
						className: day === 0 || day === 6 ? "rbc-off-day" : ""
					};
				}}
				eventPropGetter={eventPropGetter}
				components={{
					header: ({ date }) => <span>{days[date.getDay() - 1]}</span>, // Adjust for starting on Monday
					toolbar: props => <MinimalToolbar label="Schedule" />
				}}
				style={{ height: "100%" }}
				min={new Date(1970, 1, 1, 8, 0)}
				max={new Date(1970, 1, 1, 23, 0)}
				titleAccessor="title"
				tooltipAccessor="tooltip"
			/>
		</div>
	);
};
export default ScheduleCalendar;
