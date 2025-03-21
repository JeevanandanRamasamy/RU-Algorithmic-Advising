import Dropdown from "./Dropdown";

const DropdownWithSearch = ({
	query,
	handleQueryChange,
	fields,
	selectedField,
	handleSelectedFieldChange,
	searchText,
	defaultDropdownText
}) => {
	return (
		<>
			<div className="flex flex-col gap-3">
				<input
					type="text"
					id="course"
					value={query}
					onChange={handleQueryChange}
					placeholder={searchText}
					className="w-64 border border-gray-300 p-2 rounded"
				/>
				<Dropdown
					options={fields}
					selectedValue={selectedField}
					onChange={event => handleSelectedFieldChange(event.target.value)}
					placeholder={defaultDropdownText}
				/>
			</div>
		</>
	);
};

export default DropdownWithSearch;
