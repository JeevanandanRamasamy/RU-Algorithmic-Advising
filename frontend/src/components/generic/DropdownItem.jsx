import React from "react";

const DropdownItem = ({ selectedValue, onChange, placeholder, options }) => {
	return (
		<select
			className="cursor-pointer non-draggable w-full "
			value={selectedValue}
			onChange={onChange}>
			<option value="">{placeholder}</option>
			{options?.map((option, index) => (
				<option
					key={index}
					value={option}>
					{option}
				</option>
			))}
		</select>
	);
};

export default DropdownItem;
