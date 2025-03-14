import CourseTakenItem from "./CourseTakenItem";

const CourseTakenList = ({ filteredCourses }) => {
	const handleButtonClick = course => {
		console.log(`Course added: ${course}`);
	};
	return (
		<div className="h-144 overflow-y-auto w-64 p-2 border border-black rounded-2xl">
			{filteredCourses &&
				filteredCourses.map((course, index) => (
					<CourseTakenItem
						key={index}
						course={course}
						onClick={handleButtonClick}
					/>
				))}
		</div>
	);
};

export default CourseTakenList;
