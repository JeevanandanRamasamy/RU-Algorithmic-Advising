import React, { useMemo, useState, useEffect } from "react";

import useFilterCourses from "../../hooks/useFilterCourses";

import DropdownItem from "../generic/DropdownItem";
import ListItem from "../generic/ListItem";

import { schools, subjects } from "../../data/sas";
import { useCourseRecords } from "../../context/CourseRecordsContext";
import { useCourseRequirements } from "../../context/CourseRequirementContext";
import DropdownTable from "../generic/DropdownTable";
import { useTakenCourses } from "../../context/TakenCoursesContext";
import { showInfoToast, clearToast } from "../toast/Toast";
const SelectCourses = ({
	courseRecords,
	handleOnAddCourse,
	fetchSectionsBySubject,
	term,
	year,
	searchedCourses,
	setSearchedCourses
}) => {
	const { handleRemoveCourseRecord } = useCourseRecords();
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
	const { takenCourses } = useTakenCourses();

	const addedCourseIds = useMemo(() => {
		const courseRecordIds = courseRecords?.map(course => course.course_id) || [];
		const takenCourseIds = takenCourses?.map(course => course.course_id) || [];
		return [...new Set([...courseRecordIds, ...takenCourseIds])];
	}, [courseRecords, takenCourses]);

	useEffect(() => {
		setSubjectSearchQuery("");
		setSearchedCourses({});
	}, [term, year]);

	useEffect(() => {
		showInfoToast("Applying filter", "search");
		const match = subjectSearchQuery?.match(/\((\d+)\)/);
		const subjectCode = match ? match[1] : "";
		if (subjectSearchQuery && subjectCode) {
			fetchSectionsBySubject(subjectCode, term, year);
		} else {
			setSearchedCourses({});
		}
		clearToast("search");
	}, [subjectSearchQuery]);
	// const filteredSections = useMemo(() => {
	// 	return Object.values(searchedSections).filter(
	// 		section => !excludedCourseIds.includes(section.course_id)
	// 	);
	// }, [searchedSections, excludedCourseIds]);

	// const limit = useMemo(() => {
	// 	return subjectSearchQuery || schoolSearchQuery ? 200 : 50;
	// }, [subjectSearchQuery, schoolSearchQuery]);

	return (
		<>
			{/* <input
				className="w-full p-[10px] border border-gray-300 rounded text-sm box-border non-draggable mx-auto focus:outline-none"
				type="text"
				id="search-courses"
				placeholder="Search courses by name or course code"
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
			/>

			<DropdownItem
				placeholder="Search by School code"
				selectedValue={schoolSearchQuery}
				onChange={e => setSchoolSearchQuery(e.target.value)}
				options={schools}
			/> */}
			<DropdownItem
				placeholder="Search by subject code"
				selectedValue={subjectSearchQuery}
				onChange={e => setSubjectSearchQuery(e.target.value)}
				options={subjects}
			/>

			<DropdownTable
				courses={searchedCourses}
				handleOnAddCourse={handleOnAddCourse}
				handleOnRemoveCourse={handleRemoveCourseRecord}
				addedCourseIds={addedCourseIds}
			/>
			<div className="p-2 border border-gray-200 rounded-md bg-white">
				<h2 className="m-0 text-center">
					Selected Courses
					{
						<>
							{" "}
							(
							{courseRecords.reduce(
								(sum, course) => sum + parseInt(course?.credits || 0, 10),
								0
							)}
							)
						</>
					}
				</h2>
				<div className="h-[130px] overflow-y-auto w-[400px] p-2 border border-gray-200 rounded-2xl">
					{courseRecords &&
						courseRecords.map(courseRecord => (
							<ListItem
								key={courseRecord["course_id"]}
								id={courseRecord["course_id"]}
								value={`${courseRecord["course_id"]} ${courseRecord["course_name"]}`}
								onClick={handleRemoveCourseRecord}
								buttonType="-"
							/>
						))}
				</div>
			</div>
		</>
	);
};

export default SelectCourses;
