/**
 * Renders a dropdown menu without a visible placeholder.
 * Accepts an array of options, a selected value, and a change handler.
 */
const NoPlaceholderDropdown = ({ options, selectedValue, onChange, placeholder }) => {
	return (
		<select
			className="cursor-pointer"
			value={selectedValue}
			onChange={onChange}>
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

export default NoPlaceholderDropdown;
