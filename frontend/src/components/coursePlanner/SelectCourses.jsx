import React from "react";

import useFilterCourses from "../../hooks/useFilterCourses";

import DropdownItem from "../generic/DropdownItem";
import ListItem from "../generic/ListItem";

import { schools, subjects } from "../../data/sas";
import { useCourseRecords } from "../../context/CourseRecordsContext";
import { useCourseRequirements } from "../../context/CourseRequirementContext";
import DropdownTable from "../generic/DropdownTable";
const SelectCourses = ({ courseRecords, handleOnAddCourse, sections }) => {
	console.log(sections);
	const { handleRemoveCourseRecord } = useCourseRecords();
	const {
		subjectSearchQuery,
		setSubjectSearchQuery,
		schoolSearchQuery,
		setSchoolSearchQuery,
		searchQuery,
		setSearchQuery,
		filterCourses,
		limit
	} = useFilterCourses();

	const categories = [
		{
			key: "cs",
			label: "Computer Science",
			options: [
				{ value: "cs111", label: "Intro to CS" },
				{ value: "cs112", label: "Data Structures" }
			]
		},
		{
			key: "math",
			label: "Mathematics",
			options: [
				{ value: "calc1", label: "Calculus I" },
				{ value: "linear", label: "Linear Algebra" }
			]
		}
	];
	return (
		<>
			<input
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
			/>
			<DropdownItem
				placeholder="Search by subject code"
				selectedValue={subjectSearchQuery}
				onChange={e => setSubjectSearchQuery(e.target.value)}
				options={subjects}
			/>

			<DropdownTable sections={sections} />
			<div className="p-2 border border-gray-200 rounded-md bg-white">
				<div className="h-[130px] overflow-y-auto w-[400px] p-2 border border-gray-200 rounded-2xl">
					{courseRecords &&
						courseRecords.map(courseRecord => (
							<ListItem
								key={courseRecord["course_id"]}
								id={courseRecord["course_id"]}
								value={`${courseRecord["course_id"]} ${courseRecord["course_name"]}`}
								onClick={handleRemoveCourseRecord}
								buttonType="Remove"
							/>
						))}
				</div>
			</div>
		</>
	);
};

export default SelectCourses;
