import React, { useState, useMemo } from "react";
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
import CourseListContainer from "../components/courses/CourseListContainer";
import TakenCourses from "../components/courses/TakenCourses";
import AvailableCourses from "../components/courses/AvailableCourses";
import useTakenCourses from "../hooks/useTakenCourses";
import PlannedCourses from "../components/courses/PlannedCourses";
import currentSemesterCourses from "../components/courses/currentSemesterCourses";
import { useSections } from "../hooks/useSections";

const CoursePlanner = () => {
	const { courses } = useCourses();
	const { getCurrentAndNextSemester } = useSemesterInfo();
	const { enrollYear, gradYear } = useStudentDetails();

	const semesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];

	const { coursesWithMissingRequirements, fetchPlannedCoursesWithMissingRequirements } =
		useCourseRequirements();

	const { courseRecords, handleAddCourseRecord, handleRemoveCourseRecord } = useCourseRecords(
		fetchPlannedCoursesWithMissingRequirements
	);

	const [selectedSemesterTabIndex, setSelectedSemesterTabIndex] = useState(0);
	const [selectedViewTabIndex, setSelectedViewTabIndex] = useState(0);
	const { requirementStrings } = useRequirements();
	const { generateSemestersTillNow } = useSemesterInfo();
	const semestersTillNow = generateSemestersTillNow(enrollYear);

	const { takenCourses } = useTakenCourses(fetchPlannedCoursesWithMissingRequirements);
	const views = ["Select Courses", "Select Sections", "Build Schedule", "Saved Schedule"];

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

	const handleOnAddCourse = courseId => {
		handleAddCourseRecord(courseId, currentSemester.term, currentSemester.year);
	};

	const currentSemester = useMemo(() => {
		return semesters[selectedSemesterTabIndex];
	}, [semesters, selectedSemesterTabIndex]);
	const currentCourseIds = useMemo(() => {
		if (!courseRecords || !currentSemester) return [];

		return courseRecords
			.filter(
				courseRecord =>
					courseRecord.term === currentSemester.term &&
					courseRecord.year === currentSemester.year
			)
			.map(course => course?.course_info.course_id);
	}, [courseRecords, currentSemester]);
	const { fetchSections } = useSections(
		currentCourseIds,
		currentSemester.term,
		currentSemester.year
	);

	return (
		<>
			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<header className="flex justify-between items-center py-4 mb-8 border-b border-gray-300">
					<h1>Course Planner</h1>
				</header>
				{semesters.length > 0 ? (
					<>
						<Tabs
							selectedIndex={selectedSemesterTabIndex}
							onSelect={setSelectedSemesterTabIndex}>
							<TabList>
								{semesters.map((semester, index) => (
									<Tab key={index}>
										{semester.term.charAt(0).toUpperCase() +
											semester.term.slice(1)}{" "}
										{semester.year}
									</Tab>
								))}
							</TabList>
						</Tabs>
						<Tabs
							selectedIndex={selectedViewTabIndex}
							onSelect={setSelectedViewTabIndex}>
							<TabList>
								{views.map((view, index) => (
									<Tab key={index}>{view}</Tab>
								))}
							</TabList>

							{views.map((view, viewIndex) => (
								<TabPanel key={viewIndex}>
									{view === "Select Courses" && (
										<div className="flex gap-[30px]">
											<CourseListContainer
												title="Available Courses"
												courses={courses}
												excludedCourseIds={[
													...currentCourseIds,
													...(takenCourses?.length > 0
														? takenCourses.map(
																takenCourse => takenCourse.course_id
														  )
														: [])
												]}
												CourseComponent={AvailableCourses}
												requirementStrings={requirementStrings}
											/>
											<CourseListContainer
												title={`${currentSemester.term.toUpperCase()} ${
													currentSemester.year
												}`}
												courses={courseRecords
													.filter(
														courseRecord =>
															courseRecord.term ==
																currentSemester.term &&
															courseRecord.year == courseRecord.year
													)
													.map(course => course?.course_info)}
												CourseComponent={currentSemesterCourses}
												courseComponentProps={{
													onRemoveCourse: handleRemoveCourseRecord,
													onAddCourse: handleOnAddCourse,
													coursesWithMissingRequirements:
														coursesWithMissingRequirements
												}}
												requirementStrings={requirementStrings}
												hasCredits={true}
											/>
										</div>
									)}

									{view === "Select Sections" && (
										<CheckboxDropdownTable categories={categories} />
									)}

									{view === "Build Schedule" && <div>Settings UI</div>}
								</TabPanel>
							))}
						</Tabs>
					</>
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
