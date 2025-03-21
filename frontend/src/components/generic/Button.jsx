import React from "react";

const Button = ({ onClick, className, label }) => {
	return (
		<div
			onClick={onClick}
			className={`cursor-pointer text-center ${className}`}>
			{label}
		</div>
	);
};

export default Button;
