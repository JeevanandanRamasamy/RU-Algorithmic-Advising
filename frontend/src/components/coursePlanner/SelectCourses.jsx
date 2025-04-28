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
		showInfoToast("Loading", "search");
		const match = subjectSearchQuery?.match(/\((\d+)\)/);
		const subjectCode = match ? match[1] : "";
		if (subjectSearchQuery && subjectCode) {
			fetchSectionsBySubject(subjectCode, term, year);
		} else {
			setSearchedCourses({});
		}
		clearToast("search");
	}, [subjectSearchQuery]);

	return (
		<>
			<div className="flex gap-4 items-start">
				<div className="w-[30%] h-[650px] p-2 border border-gray-200 rounded-md bg-white flex flex-col gap-2">
					<DropdownItem
						placeholder="Search by subject code"
						selectedValue={subjectSearchQuery}
						onChange={e => setSubjectSearchQuery(e.target.value)}
						options={subjects}
					/>

					<div className="p-2 border border-gray-200 rounded-md bg-white flex flex-col flex-1">
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
						<div className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-2xl">
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
				</div>

				<div className="flex-1">
					<DropdownTable
						courses={searchedCourses}
						handleOnAddCourse={handleOnAddCourse}
						handleOnRemoveCourse={handleRemoveCourseRecord}
						addedCourseIds={addedCourseIds}
					/>
				</div>
			</div>
		</>
	);
};

export default SelectCourses;
