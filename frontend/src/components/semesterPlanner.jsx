import useStudentDetails from "../hooks/useStudentDetails";
import DropCoursesContainer from "../components/dropCoursesContainer";
import { generateSemesters, generateSemestersTillNow } from "../helpers/semesters";

const SemesterPlanner = ({ plannedCourses, handleAddPlannedCourse, handleRemovePlannedCourse }) => {
	const { enrolledYear, gradYear } = useStudentDetails();
	const semesters = generateSemesters(enrolledYear, gradYear);
	const semestersTillNow = generateSemestersTillNow(enrolledYear);

	return (
		<>
			<div className="grid grid-cols-4 gap-4">
				{semesters.map(({ term, year }) => {
					return (
						<DropCoursesContainer
							key={`${term} ${year}`}
							term={term}
							year={year}
							courses={plannedCourses}
							getCourse={course => course.course_info}
							handleAddPlannedCourse={handleAddPlannedCourse}
							handleRemovePlannedCourse={handleRemovePlannedCourse}
							semestersTillNow={semestersTillNow}
						/>
					);
				})}
			</div>
		</>
	);
};

export default SemesterPlanner;
