import React from "react";
import ListItem from "./ListItem";

const ListContainer = ({ query, handleQueryChange, values, searchText, type }) => {
	const handleButtonClick = (type, value) => {
		console.log(`${type} added: ${value}`);
	};
	return (
		<div className="flex flex-col gap-3">
			<input
				type="text"
				value={query}
				onChange={handleQueryChange}
				placeholder={searchText}
				className="w-64 border border-gray-300 p-2 rounded"
			/>
			<div className="h-144 overflow-y-auto w-64 p-2 border border-black rounded-2xl">
				{values &&
					values.map(value => (
						<ListItem
							key={value}
							value={value}
							onClick={handleButtonClick}
							type={type}
						/>
					))}
			</div>
		</div>
	);
};

export default ListContainer;
