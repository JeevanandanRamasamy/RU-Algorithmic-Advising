import React from "react";

/**
 * DropdownItem component renders a select input field with a list of options.
 * It handles the selection and triggering of a change event when a new option is selected.
 */
const DropdownItem = ({ selectedValue, onChange, placeholder, options }) => {
	return (
		<select
			className="cursor-pointer non-draggable w-full"
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
