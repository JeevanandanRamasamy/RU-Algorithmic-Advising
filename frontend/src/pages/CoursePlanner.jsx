import React, { useState } from "react";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useSemesterInfo from "../hooks/useSemesterInfo";
import useStudentDetails from "../hooks/useStudentDetails";
import DraggableCourseList from "../components/courses/draggableCourseList";

import useCourses from "../hooks/useCourses";
import HorizontalAvailableCourses from "../components/courses/HorizontalAvailableCourses";

import useRequirements from "../hooks/useRequirements";
import useCourseRecords from "../hooks/useCourseRecords";
import useCourseRequirements from "../hooks/useCourseRequirements";

import Button from "../components/generic/Button";

import DropCoursesContainer from "../components/courses/dropCoursesContainer";
import CheckboxDropdownTable from "../components/generic/CheckBoxDropdownTable";

const CoursePlanner = () => {
	const { courses } = useCourses();
	const { getCurrentAndNextSemester } = useSemesterInfo();
	const { enrollYear, gradYear } = useStudentDetails();
	// const semesters = getCurrentAndNextSemester(gradYear);
	const semesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];

	const { coursesWithMissingRequirements, fetchPlannedCoursesWithMissingRequirements } =
		useCourseRequirements();

	const {
		courseRecords,
		setCourseRecords,
		coursesRecordsLoading,
		setCoursesRecordsLoading,
		coursesRecordsError,
		setCourseRecordsError,
		handleAddCourseRecord,
		handleRemoveCourseRecord
	} = useCourseRecords(fetchPlannedCoursesWithMissingRequirements);

	const [selectedSemesterTabIndex, setSelectedSemesterTabIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const { requirementStrings, validateSchedule } = useRequirements();

	const currentSemester = semesters[selectedSemesterTabIndex];

	const { generateSemesters, generateSemestersTillNow } = useSemesterInfo();
	const semestersTillNow = generateSemestersTillNow(enrollYear);
	console.log(courseRecords, currentSemester);
	console.log(
		courseRecords
			.filter(
				course =>
					course?.term === currentSemester.term && course?.year === currentSemester.year
			)
			.map(course => course?.course_info.course_id)
	);
	const categories = [
		{
			key: "fruits",
			label: "Fruits",
			options: [
				{ value: "apple", label: "🍎 Apple" },
				{ value: "banana", label: "🍌 Banana" },
				{ value: "orange", label: "🍊 Orange" }
			]
		},
		{
			key: "vegetables",
			label: "Vegetables",
			options: [
				{ value: "carrot", label: "🥕 Carrot" },
				{ value: "spinach", label: "🥬 Spinach" },
				{ value: "broccoli", label: "🥦 Broccoli" }
			]
		}
	];

	return (
		<>
			<DraggableCourseList
				title="Available Courses"
				courses={courses}
				excludedCourseIds={[
					...(courseRecords?.length > 0
						? courseRecords
								.filter(
									course =>
										course?.term === currentSemester.term &&
										course?.year === currentSemester.year
								)
								.map(course => course?.course_info.course_id)
						: [])
				]}
				CourseComponent={HorizontalAvailableCourses}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				requirementStrings={requirementStrings}
			/>

			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<header className="flex justify-between items-center py-4 mb-8 border-b border-gray-300">
					<h1>Course Planner</h1>
				</header>

				<div className="pb-2 flex justify-end gap-2">
					<Button
						onClick={() => setIsOpen(!isOpen)}
						className="p-2 flex items-center justify-center rounded bg-blue-500 text-white  border border-black"
						label={isOpen ? "Close Available Courses" : "Open Available Courses"}
					/>
				</div>

				{semesters.length > 0 ? (
					<Tabs
						selectedIndex={selectedSemesterTabIndex}
						onSelect={index => setSelectedTabIndex(index)}>
						<TabList>
							{semesters.map((semester, index) => (
								<Tab key={index}>
									{semester.term.charAt(0).toUpperCase() + semester.term.slice(1)}{" "}
									{semester.year}
								</Tab>
							))}
						</TabList>

						{semesters.map((semester, index) => {
							const { term, year } = semester;

							// const courseIdsThisSemester =
							// 	courseRecords?.length > 0
							// 		? courseRecords
							// 				.filter(
							// 					course =>
							// 						course?.semester.term === term &&
							// 						course?.semester.year === year
							// 				)
							// 				.map(course => course?.course_info.course_id)
							// 		: [];

							return (
								<TabPanel key={index}>
									<>
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
											coursesWithMissingRequirements={
												coursesWithMissingRequirements
											}
											hasCredits={true}
										/>
										<CheckboxDropdownTable categories={categories} />
									</>
								</TabPanel>
							);
						})}
					</Tabs>
				) : (
					<p>
						There are no valid schedules to choose from. Please change your graduation
						date.
					</p>
				)}
			</div>
		</>
	);
};

export default CoursePlanner;
