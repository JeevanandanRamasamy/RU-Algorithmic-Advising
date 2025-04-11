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
