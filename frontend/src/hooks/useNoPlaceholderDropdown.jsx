import { useState } from "react";

/**
 * Custom hook to manage a dropdown selection without a placeholder.
 * It keeps track of the selected option and renders the dropdown.
 *
 * @param {Array} options - The options to display in the dropdown.
 * @param {string} defaultValue - The default value for the dropdown.
 * @returns {Object} - An object containing the selected value and the JSX for the dropdown.
 */
const useNoPlaceholderDropdown = (options, defaultValue = "") => {
	const [selected, setSelected] = useState(defaultValue || options[0]);

	/**
	 * Handles the change event for the dropdown.
	 * Updates the selected value when the user selects an option.
	 *
	 * @param {Event} e - The change event from the dropdown.
	 */
	const onChange = e => setSelected(e.target.value);

	// Return the selected value and the JSX for the dropdown
	const dropdown = (
		<select
			value={selected}
			onChange={onChange}
			className="cursor-pointer">
			{options.map((option, index) => (
				<option
					key={index}
					value={option}>
					{option}
				</option>
			))}
		</select>
	);

	return { selected, dropdown };
};

export default useNoPlaceholderDropdown;
