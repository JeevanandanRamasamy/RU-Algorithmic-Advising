import React, { useMemo, useState, useEffect } from "react";
import DropdownItem from "../generic/DropdownItem";
import ListItem from "../generic/ListItem";
import { subjects } from "../../data/sas";
import { useCourseRecords } from "../../context/CourseRecordsContext";
import DropdownTable from "../generic/DropdownTable";
import { useTakenCourses } from "../../context/TakenCoursesContext";
import { showInfoToast, clearToast } from "../toast/Toast";
import OpenClosedLegend from "../calendar/OpenClosedLegend";

/**
 * Component for selecting courses, searching by subject code, displaying selected courses,
 * and handling the addition/removal of courses.
 */
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

	// Memoize added course IDs to avoid recalculating on every render
	const addedCourseIds = useMemo(() => {
		const courseRecordIds = courseRecords?.map(course => course.course_id) || [];
		const takenCourseIds = takenCourses?.map(course => course.course_id) || [];
		return [...new Set([...courseRecordIds, ...takenCourseIds])];
	}, [courseRecords, takenCourses]);

	// Effect to reset search query and searched courses whenever the term or year changes
	useEffect(() => {
		setSubjectSearchQuery("");
		setSearchedCourses({});
	}, [term, year]);

	// Effect to search for courses based on the subject code when the search query changes
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
			<OpenClosedLegend />
			<div className="flex gap-4 items-start">
				<div className="w-[35%] h-[650px] p-2 border border-gray-200 rounded-md bg-white flex flex-col gap-2">
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
									)}{" "}
									Credits)
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
