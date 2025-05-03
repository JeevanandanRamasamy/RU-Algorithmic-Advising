import React from "react";

/**
 * Renders a progress bar with a filled portion based on the provided value and max.
 * Ensures the percentage stays between 0 and 100.
 */
const Progress = ({ value, max = 100 }) => {
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	return (
		<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
			<div
				className="bg-blue-500 h-full transition-all duration-300"
				style={{ width: `${percentage}%` }}></div>
		</div>
	);
};

export default Progress;
