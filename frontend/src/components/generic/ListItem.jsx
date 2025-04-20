import React from "react";
import Button from "../generic/Button";

const ListItem = ({ id, value, onClick, buttonType }) => {
	return (
		<div className="flex justify-between items-center p-2 border-b">
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
