import React, { useState, useMemo, useEffect } from "react";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useSemesterInfo from "../hooks/useSemesterInfo";
import DraggableCourseList from "../components/courses/draggableCourseList";
import HorizontalAvailableCourses from "../components/courses/HorizontalAvailableCourses";

import { useCourses } from "../context/CoursesContext";
import { useStudentDetails } from "../context/StudentDetailsContext";
import { useCourseRequirements } from "../context/CourseRequirementContext";
import { useCourseRecords } from "../context/CourseRecordsContext";
import { useTakenCourses } from "../context/TakenCoursesContext";

import useSections from "../hooks/useSections";
import Button from "../components/generic/Button";
import DropCoursesContainer from "../components/courses/dropCoursesContainer";
import CheckboxDropdownTable from "../components/generic/CheckBoxDropdownTable";
import CourseListContainer from "../components/courses/CourseListContainer";
import TakenCourses from "../components/courses/TakenCourses";
import AvailableCourses from "../components/courses/AvailableCourses";
import PlannedCourses from "../components/courses/PlannedCourses";
import currentSemesterCourses from "../components/courses/currentSemesterCourses";
import BuildSchedule from "../components/coursePlanner/BuildSchedule";
import SavedSchedule from "../components/coursePlanner/SavedSchedule";
import SelectCourses from "../components/coursePlanner/SelectCourses";
import SelectSections from "../components/coursePlanner/SelectSections";

const CoursePlanner = () => {
	const { getCurrentAndNextSemester } = useSemesterInfo();

	const semesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];

	//TODO: highlight in red if you can not take the course
	// const {
	// 	coursesWithMissingRequirements,
	// 	fetchPlannedCoursesWithMissingRequirements,
	// 	requirementStrings
	// } = useCourseRequirements();
	const { courses } = useCourses();
	const { enrollYear, gradYear } = useStudentDetails();
	const { courseRecords, handleAddCourseRecord, handleRemoveCourseRecord } = useCourseRecords();
	const { takenCourses } = useTakenCourses();

	const [selectedSemesterTabIndex, setSelectedSemesterTabIndex] = useState(0);
	const [selectedViewTabIndex, setSelectedViewTabIndex] = useState(0);
	const { generateSemestersTillNow } = useSemesterInfo();
	const semestersTillNow = generateSemestersTillNow(enrollYear);

	const {
		fetchSectionsBySubject,
		getSemesterNumber,
		fetchSectionsByCourse,
		courseAvailableThisSemester,
		searchedCourses,
		setSearchedCourses,
		selectedCourses,
		setSelectedCourses,
		checkedSections,
		setCheckedSections,
		fetchSectionsByCourses
	} = useSections();

	const views = ["Select Courses", "Select Sections", "Build Schedule", "Saved Schedule"];

	const handleOnAddCourse = courseId => {
		handleAddCourseRecord(courseId, currentSemester.term, currentSemester.year);
	};

	const currentSemester = useMemo(() => {
		return semesters[selectedSemesterTabIndex];
	}, [semesters, selectedSemesterTabIndex]);

	const currentCourseRecords = useMemo(() => {
		if (!courseRecords || !currentSemester) return [];
		return courseRecords
			.filter(
				courseRecord =>
					courseRecord.term === currentSemester.term &&
					courseRecord.year === currentSemester.year
			)
			.map(course => course?.course_info);
	}, [courseRecords, currentSemester]);

	useEffect(() => {
		if (!currentCourseRecords.length || !currentSemester) return;
		fetchSectionsByCourses(
			currentCourseRecords.map(course => course.course_id),
			currentSemester.term,
			currentSemester.year
		);
	}, [currentCourseRecords, currentSemester]);

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
										<SelectCourses
											courseRecords={currentCourseRecords}
											handleOnAddCourse={handleOnAddCourse}
											fetchSectionsBySubject={fetchSectionsBySubject}
											term={currentSemester.term}
											year={currentSemester.year}
											searchedCourses={searchedCourses}
											setSearchedCourses={setSearchedCourses}
										/>
									)}
									{view === "Select Sections" && (
										<SelectSections
											courseRecords={currentCourseRecords}
											term={currentSemester.term}
											year={currentSemester.year}
											selectedCourses={selectedCourses}
											setSelectedCourses={setSelectedCourses}
											checkedSections={checkedSections}
											setCheckedSections={setCheckedSections}
										/>
									)}

									{view === "Build Schedule" && <BuildSchedule />}
									{view == "Saved Schedule" && <SavedSchedule />}
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
