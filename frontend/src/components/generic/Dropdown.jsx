/**
 * Dropdown component that renders a select input field with options.
 * It handles the selection of an option and triggers a change event
 * when a new option is selected.
 */
const Dropdown = ({ options, selectedValue, onChange, placeholder }) => {
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

export default Dropdown;
