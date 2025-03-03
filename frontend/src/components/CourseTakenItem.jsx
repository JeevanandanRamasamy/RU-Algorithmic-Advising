import Button from "./Button";
//TODO: need a way to know if course has already been added
const CourseTakenItem = ({ course, onClick }) => {
	return (
		<div className="flex justify-between items-center p-2 border-b">
			<span>{course}</span>
			<Button
				onClick={() => onClick(course)}
				className="bg-blue-500 text-white p-1 rounded"
				label="Add"
			/>
		</div>
	);
};

export default CourseTakenItem;
