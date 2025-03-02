import React from "react";
import Button from "./Button";

const ListItem = ({ type, value, onClick }) => {
	return (
		<div className="flex justify-between items-center p-2 border-b">
			<span>{value}</span>
			<Button
				onClick={() => onClick(type, value)}
				className="bg-blue-500 text-white p-1 rounded"
				label="Add"
			/>
		</div>
	);
};

export default ListItem;
