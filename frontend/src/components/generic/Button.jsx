import React from "react";

/**
 * Button component renders a customizable button element.
 * The button supports an onClick handler, custom CSS classes,
 * and a label to display inside the button.
 */
const Button = ({ onClick, className, label }) => {
	return (
		<button
			onClick={onClick}
			className={`cursor-pointer text-center border-none ${className}`}>
			{label}
		</button>
	);
};

export default Button;
