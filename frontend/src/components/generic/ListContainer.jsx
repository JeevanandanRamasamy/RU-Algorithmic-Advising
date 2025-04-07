import React from "react";
import ListItem from "./ListItem";

const ListContainer = ({
	query,
	handleQueryChange,
	values,
	searchText,
	key_field,
	field,
	buttonType,
	handleButtonClick,
	excludedByKeys = []
}) => {
	return (
		<div className="flex flex-col gap-3 bg-white">
			<input
				type="text"
				value={query}
				onChange={handleQueryChange}
				placeholder={searchText}
				className="w-[400px] border border-gray-300 p-2 rounded"
			/>
			<div className="h-[130px] overflow-y-auto w-[400px] p-2 border border-gray-200 rounded-2xl">
				{values &&
					values
						.filter(value => !excludedByKeys.includes(value[key_field]))
						.map(value => (
							<ListItem
								key={value[key_field]}
								id={value[key_field]}
								value={value[field]}
								onClick={handleButtonClick}
								buttonType={buttonType}
							/>
						))}
			</div>
		</div>
	);
};

export default ListContainer;
