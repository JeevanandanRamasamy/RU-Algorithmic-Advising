import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import React from "react";
import "../../css/ScheduleCalendar.css";
import useSemester from "../../hooks/useSemester";

/**
 * MinimalToolbar
 * Displays a simple toggle between calendar and list views if view switching is enabled.
 */
const MinimalToolbar = ({ view, setView, hasView, term, year, courses }) => {
	const { generateUrl } = useSemester();

	const uniqueIndices =
		Array.isArray(courses) && courses.length > 0
			? [...new Set(courses.map(course => course.index))]
			: [];

	return (
		<>
			{!hasView ? (
				<div style={{ textAlign: "center", padding: "0.5rem", fontWeight: "bold" }}></div>
			) : (
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
					<a
						href={generateUrl(term, year, uniqueIndices)}
						target="_blank"
						rel="noopener noreferrer"
						className="underline cursor-pointer text-blue-600">
						Register
					</a>
				</div>
			)}
		</>
	);
};

/**
 * ScheduleCalendar
 * Displays a weekly schedule in calendar format using react-big-calendar.
 * - Events are styled based on their `open_status` and `background_color`.
 * - Week starts on Monday.
 * - Only weekdays (Mon-Fri) are emphasized.
 */
const ScheduleCalendar = ({ index, map, hasView, view, setView, term, year }) => {
	const locales = {
		"en-US": enUS
	};

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
		getDay,
		locales
	});
	const eventPropGetter = event => ({
		style: {
			minHeight: "30px",
			width: "100%",
			fontSize: "0.75rem",
			border: event.open_status === false ? "3px dashed #cc0033" : "none",
			backgroundColor: event.background_color,
			color: event.open_status === false ? "#cc0033" : "black"
		}
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
					toolbar: () => (
						<MinimalToolbar
							hasView={hasView}
							view={view}
							setView={setView}
							term={term}
							year={year}
							courses={map[index]}
						/>
					)
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
