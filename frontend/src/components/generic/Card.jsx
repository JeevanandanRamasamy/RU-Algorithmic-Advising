import React from "react";
import clsx from "clsx";

/**
 * Card component that provides a styled container with customizable classes.
 * The card features a border, background color, and hover effect.
 */
export const Card = ({ children, className = "" }) => {
	return (
		<div
			className={clsx(
				"rounded-2xl border border-gray-200 bg-[#fcf8d7] shadow-md", // Updated background color for card
				"transition-all duration-300 ease-in-out hover:shadow-lg",
				className
			)}>
			{children}
		</div>
	);
};

/**
 * CardContent component that wraps content within the card with padding.
 * It allows custom styling and has a default text color.
 */
export const CardContent = ({ children, className = "" }) => {
	return (
		<div className={clsx("p-4", className)}>
			<div className="text-[#cc0033]">{children}</div>
		</div>
	);
};

export default Card;
