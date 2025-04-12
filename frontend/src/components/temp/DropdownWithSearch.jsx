import React, { useState } from "react";
import { subjects, schools } from "../../data/sas";
import DropdownItem from "./DropdownItem";
import CourseList from "../courses/CourseList";

const SearchWithDropdowns = ({
	courses,
	getCourse,
	searchQuery,
	setSearchQuery,
	handleSubjectFilter,
	handleSchoolFilter,
	courseComponentProps
}) => {
	// const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	return (
		<div className="w-full max-w-md mx-auto">
			<div
				className="flex items-center justify-between cursor-pointer mb-2"
				onClick={() => setShowFilters(prev => !prev)}>
				<span className="text-lg font-medium">Filters</span>
				<span
					className={`transform transition-transform duration-300 ${
						showFilters ? "rotate-180" : ""
					}`}>
					▼
				</span>
			</div>
			<div
				className={`grid gap-4 transition-all duration-300 overflow-hidden ${
					showFilters ? "max-h-[9999x] opacity-100" : "max-h-0 opacity-0"
				}`}>
				<input
					className="w-full p-[10px] border border-gray-300 rounded text-sm box-border non-draggable mx-auto"
					type="text"
					id="search-courses"
					placeholder="Search courses"
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>

				<DropdownItem
					placeholder="All Subjects"
					onChange={() => {}}
					options={subjects}
				/>

				<DropdownItem
					placeholder="All Schools"
					onChange={() => {}}
					options={schools}
				/>

				<CourseList
					courses={courses}
					getCourse={getCourse}
					{...courseComponentProps}
				/>
			</div>
		</div>
	);
};

export default SearchWithDropdowns;
