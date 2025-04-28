import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const CustomEvent = ({ event }) => {
	const tooltipId = `event-tooltip-${event.title}-${event.startTime}-${day}`;

	return (
		<>
			<div
				data-tooltip-id={tooltipId}
				style={{
					backgroundColor: "#3174ad",
					color: "white",
					padding: "5px",
					borderRadius: "4px",
					fontSize: "0.75rem",
					cursor: "pointer",
					width: "100%",
					height: "100%"
				}}></div>
		</>
	);
};

export default CustomEvent;
