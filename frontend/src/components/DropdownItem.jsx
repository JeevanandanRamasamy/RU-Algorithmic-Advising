import React from "react";

const DropdownItem = () => {
	return (
		<select
			className="cursor-pointer"
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
