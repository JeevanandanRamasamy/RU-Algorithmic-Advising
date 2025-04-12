import useStudentDetails from "../../hooks/useStudentDetails";
import DropCoursesContainer from "../courses/dropCoursesContainer";
import useCourseRequirements from "../../hooks/useCourseRequirements";
import useSemesterInfo from "../../hooks/useSemesterInfo";

const SemesterPlanner = ({
	courses,
	courseRecords,
	handleAddCourseRecord,
	handleRemoveCourseRecord,
	takenCourses,
	requirementStrings,
	coursesWithMissingRequirements
}) => {
	const { enrollYear, gradYear } = useStudentDetails();
	const { generateSemesters, generateSemestersTillNow } = useSemesterInfo();
	const semesters = generateSemesters(enrollYear, gradYear);
	const semestersTillNow = generateSemestersTillNow(enrollYear);

	return (
		<>
			<div className="grid grid-cols-4 gap-4">
				{semesters.map(({ term, year }) => {
					return (
						<DropCoursesContainer
							key={`${term} ${year}`}
							term={term}
							year={year}
							courseRecords={courseRecords}
							getCourse={course => course.course_info}
							handleAddPlannedCourse={handleAddCourseRecord}
							handleRemovePlannedCourse={handleRemoveCourseRecord}
							semestersTillNow={semestersTillNow}
							requirementStrings={requirementStrings}
							coursesWithMissingRequirements={coursesWithMissingRequirements}
							hasCredits={true}
						/>
					);
				})}
			</div>
		</>
	);
};

export default SemesterPlanner;
