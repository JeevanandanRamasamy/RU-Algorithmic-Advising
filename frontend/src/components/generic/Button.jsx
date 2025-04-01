import React from "react";

const Button = ({ onClick, className, label }) => {
	return (
		<button
			onClick={onClick}
			className={`cursor-pointer text-center ${className}`}>
			{label}
		</button>
	);
};

export default Button;
