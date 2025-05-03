import React from "react";
import Button from "../generic/Button";

/**
 * Renders a list item with a value and a button.
 * When the button is clicked, it triggers the onClick callback with the item's ID.
 */
const ListItem = ({ id, value, onClick, buttonType }) => {
	return (
		<div className="flex justify-between items-center p-2 border-b gap-1">
			<span>{value}</span>
			<Button
				onClick={() => onClick(id)}
				className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded font-bold"
				label={buttonType}
			/>
		</div>
	);
};

export default ListItem;
