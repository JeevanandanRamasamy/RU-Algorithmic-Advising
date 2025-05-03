import React from "react";
import Button from "../generic/Button";

/**
 * Renders a list item with a clickable link and an action button.
 * The link and button trigger their respective handlers.
 * Text color of the link changes if the item is selected.
 */
const ListItemWithLink = ({ id, value, linkOnClick, onClick, buttonType, isSelected }) => {
	return (
		<div className="flex justify-between items-center p-2 border-b">
			<a
				className={`cursor-pointer ${
					isSelected ? "text-black" : "text-blue-600"
				} underline`}
				onClick={linkOnClick}>
				{value}
			</a>
			<Button
				onClick={() => onClick(id)}
				className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded font-bold"
				label={buttonType}
			/>
		</div>
	);
};

export default ListItemWithLink;
