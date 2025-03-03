const Dropdown = ({ options, selectedValue, onChange, placeholder }) => {
	console.log(selectedValue);
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
