/**
 * CalendarLegend is a UI component that renders a legend explaining
 * the color codes used in the course calendar for different campuses
 * and section statuses (open/closed).
 */
const CalendarLegend = () => {
	const campusColors = {
		"LIVINGSTON": "bg-[#ffcc99]",
		"BUSCH": "bg-[#cceeff]",
		"DOUGLAS/COOK": "bg-[#ddffdd]",
		"COLLEGE AVENUE": "bg-[#ffffcc]",
		"DOWNTOWN": "bg-[#ffd7ef]",
		"ONLINE": "bg-[#ff8080]"
	};

	return (
		<div className="flex flex-wrap gap-4 mb-4">
			{Object.entries(campusColors).map(([label, color]) => (
				<div
					key={label}
					className="flex items-center gap-2">
					<div className={`w-4 h-4 border border-gray-400 rounded-sm ${color}`} />
					<span className="text-sm">{label}</span>
				</div>
			))}

			<div className="flex items-center gap-2">
				<div className="w-4 h-4 border-2 border-dashed border-black rounded-sm bg-white" />
				<span className="text-sm text-black">Open Section</span>
			</div>

			<div className="flex items-center gap-2">
				<div className="w-4 h-4 border-2 border-dashed border-[#cc0033] rounded-sm bg-white" />
				<span className="text-sm text-[#cc0033]">Closed Section</span>
			</div>
		</div>
	);
};

export default CalendarLegend;
