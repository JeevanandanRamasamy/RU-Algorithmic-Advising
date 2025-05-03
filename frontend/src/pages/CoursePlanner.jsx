import React, { useState, useMemo, useEffect } from "react";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import NotificationsButton from "../components/widgets/Notifications";
import Chatbot from "../components/widgets/Chatbot";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useSemesterInfo from "../hooks/useSemesterInfo";

import { useCourses } from "../context/CoursesContext";
import { useStudentDetails } from "../context/StudentDetailsContext";
import { useCourseRecords } from "../context/CourseRecordsContext";
import { useTakenCourses } from "../context/TakenCoursesContext";
import { useSections } from "../context/SectionsContext";
import BuildSchedule from "../components/coursePlanner/BuildSchedule";
import SavedSchedule from "../components/coursePlanner/SavedSchedule";
import SelectCourses from "../components/coursePlanner/SelectCourses";
import SelectSections from "../components/coursePlanner/SelectSections";

/**
 * CoursePlanner Component for managing course selection, section selection,
 * and schedule generation for students. It interacts with hooks to fetch
 * semester info, courses, and student details, and supports adding/removing
 * courses and generating valid schedules.
 */
const CoursePlanner = () => {
	const { getCurrentAndNextSemester } = useSemesterInfo();

	const currentYear = new Date().getFullYear();

	// Function to get next term
	const getNextTerm = (month, year) => {
		if (month < 2) return { term: "spring", year };
		if (month < 5) return { term: "summer", year };
		if (month < 8) return { term: "fall", year };
		return { term: "winter", year: year + 1 }; // winter counts for next year
	};

	const month = new Date().getMonth();

	const firstSemester = getNextTerm(month, currentYear);

	let secondSemester;

	// Function to get next semester
	switch (firstSemester.term) {
		case "spring":
			secondSemester = { term: "summer", year: currentYear };
			break;
		case "summer":
			secondSemester = { term: "fall", year: currentYear };
			break;
		case "fall":
			secondSemester = { term: "winter", year: currentYear + 1 };
			break;
		case "winter":
			secondSemester = { term: "spring", year: currentYear + 1 };
			break;
		default:
			throw new Error("Unknown semester term");
	}

	const semesters = [firstSemester, secondSemester];

	const { courses } = useCourses();
	const { enrollYear, gradYear } = useStudentDetails();
	const { courseRecords, courseRecordsRef, handleAddCourseRecord, handleRemoveCourseRecord } =
		useCourseRecords();
	const { takenCourses } = useTakenCourses();

	const [selectedSemesterTabIndex, setSelectedSemesterTabIndex] = useState(0);
	const [selectedViewTabIndex, setSelectedViewTabIndex] = useState(0);
	const { generateSemestersTillNow } = useSemesterInfo();
	const semestersTillNow = generateSemestersTillNow(enrollYear);

	const {
		getSemesterNumber,
		fetchSectionsByCourse,
		updateSelectedCourseSections,
		courseAvailableThisSemester,
		fetchSectionsBySubject,
		searchedCourses,
		setSearchedCourses,
		selectedCourses,
		setSelectedCourses,
		checkedSections,
		setCheckedSections,
		indexToMeetingTimesMap,
		setIndexToMeetingTimesMap,
		generateValidSchedules,
		validSchedules,
		setValidSchedules,
		scheduleIndex,
		setScheduleIndex,
		generateEventsForSchedule,
		fetchSavedSchedules
	} = useSections();

	const views = ["Select Courses", "Select Sections", "Build Schedule", "Saved Schedule"];

	// Handles add courses
	const handleOnAddCourse = courseId => {
		handleAddCourseRecord(courseId, currentSemester.term, currentSemester.year);
	};

	useEffect(() => {
		fetchSavedSchedules();
	}, []);

	// Memo to get current semester
	const currentSemester = useMemo(() => {
		return semesters[selectedSemesterTabIndex];
	}, [semesters, selectedSemesterTabIndex]);

	// get courseRecords for current term
	const currentCourseRecords = useMemo(() => {
		return courseRecordsRef.current
			.filter(
				courseRecord =>
					courseRecord.term === currentSemester.term &&
					courseRecord.year === currentSemester.year
			)
			.map(course => course?.course_info);
	}, [courseRecordsRef, currentSemester]);

	// UseEffect to update current course selections
	useEffect(() => {
		updateSelectedCourseSections(
			currentCourseRecords.map(course => course.course_id),
			currentSemester.term,
			currentSemester.year
		);
	}, [currentCourseRecords, currentSemester]);

	// useEffect to initialize checked sections based on selected courses
	useEffect(() => {
		const initialCheckedSections = {};
		Object.values(selectedCourses).forEach(({ course_id, sections }) => {
			const allSectionIndex = new Set(Object.values(sections).map(s => s.index));
			initialCheckedSections[course_id] = allSectionIndex;
		});
		setCheckedSections(initialCheckedSections);
	}, [selectedCourses]);

	// useEffect to generate valid schedules whenever checkedSections change
	useEffect(() => {
		generateValidSchedules();
	}, [checkedSections]);

	// useEffect to reset schedule index and generate events when validSchedules change
	useEffect(() => {
		setScheduleIndex(0);
		generateEventsForSchedule();
	}, [validSchedules]);

	// Toggles section selection for a given course and index
	const toggleSectionSelect = (course_id, index) => {
		setCheckedSections(prev => {
			const currentSet = prev[course_id] || new Set();
			const updatedSet = new Set(currentSet);
			if (updatedSet.has(index)) {
				updatedSet.delete(index);
			} else {
				updatedSet.add(index);
			}
			return { ...prev, [course_id]: updatedSet };
		});
	};
	// Checks if a specific section is selected
	const isSectionSelected = (course_id, index) => {
		return checkedSections[course_id]?.has(index);
	};
	// Checks if all sections of a course are selected
	const isAllSectionsSelected = (course_id, courseSections) =>
		checkedSections[course_id]?.size === Object.keys(courseSections).length;
	// Handles selecting or deselecting all sections of a course
	const handleSelectAll = (e, course_id, sections) => {
		e.stopPropagation();
		if (isAllSectionsSelected(course_id, sections)) {
			setCheckedSections(prev => ({ ...prev, [course_id]: new Set() }));
		} else {
			const allSectionIndices = new Set(Object.values(sections).map(s => s.index));
			setCheckedSections(prev => ({
				...prev,
				[course_id]: allSectionIndices
			}));
		}
	};

	return (
		<>
			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<NotificationsButton />
				<Chatbot />
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
											toggleSectionSelect={toggleSectionSelect}
											isSectionSelected={isSectionSelected}
											handleSelectAll={handleSelectAll}
											isAllSectionsSelected={isAllSectionsSelected}
										/>
									)}

									{view === "Build Schedule" && (
										<BuildSchedule
											term={currentSemester.term}
											year={currentSemester.year}
										/>
									)}
									{view == "Saved Schedule" && (
										<SavedSchedule
											term={currentSemester.term}
											year={currentSemester.year}
										/>
									)}
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
