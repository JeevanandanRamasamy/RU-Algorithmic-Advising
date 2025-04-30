import React from "react";

/**
 * OpenClosedLegend Component
 *
 * Displays a visual legend that explains the meaning of open and closed course section indicators.
 * Used in course scheduling UIs to help users interpret dashed border color codes.
 */
const OpenClosedLegend = () => {
	return (
		<div className="flex flex-wrap gap-4 pb-2 justify-end">
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

export default OpenClosedLegend;
