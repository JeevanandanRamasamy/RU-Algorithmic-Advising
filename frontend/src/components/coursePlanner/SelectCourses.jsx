import React from "react";

import useFilterCourses from "../../hooks/useFilterCourses";
import DropdownItem from "../generic/DropdownItem";

import { schools, subjects } from "../../data/sas";
const SelectCourses = ({ courseRecords, requirementStrings, handleRemoveCourse }) => {
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

			<div className="p-2 border border-gray-200 rounded-md bg-white">
				<div className="h-[130px] overflow-y-auto w-[400px] p-2 border border-gray-200 rounded-2xl">
					{courseRecords &&
						courseRecords.map(courseRecord => (
							<ListItem
								key={courseRecord[course_id]}
								id={courseRecord[course_id]}
								value={requirementStrings[courseRecord[course_id]]}
								onClick={handleButtonClick}
								buttonType={buttonType}
							/>
						))}
				</div>
			</div>
		</>
	);
};

export default SelectCourses;
