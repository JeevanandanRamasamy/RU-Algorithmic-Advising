import React, { useState } from "react";
import DropdownItem from "../generic/DropdownItem";
import { schools, subjects } from "../../data/sas";
import DropdownWithSearch from "../generic/DropdownWithSearch";
import useFilterCourses from "../../hooks/useFilterCourses";
import { AnimatePresence, motion } from "framer-motion";

const CourseListContainer = ({
	title = "",
	courses = [],
	excludedCourseIds = [],
	getCourse = course => course,
	CourseComponent,
	courseComponentProps,
	requirementStrings,
	hasCredits = false,
	coursesWithMissingRequirements
}) => {
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

	const [showFilters, setShowFilters] = useState(false);

	return (
		<section className="flex-1 bg-white rounded-lg shadow-md p-5 h-[600px] flex flex-col">
			<h2 className="m-0 text-center">
				{title}
				{hasCredits && (
					<>
						{" "}
						(
						{filterCourses(courses, excludedCourseIds)
							.map(getCourse)
							.reduce((sum, course) => sum + parseInt(course?.credits || 0, 10), 0)}
						)
					</>
				)}
			</h2>

			<div className="py-2">
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

				<AnimatePresence initial={false}>
					{showFilters && (
						<motion.div
							key="filters"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden grid gap-4">
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
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{/* <div className={`p-2 border border-gray-200 rounded-md `}> */}
			<CourseComponent
				courses={filterCourses(courses, excludedCourseIds)}
				getCourse={getCourse}
				limit={limit}
				showFilters={showFilters}
				requirementStrings={requirementStrings}
				{...courseComponentProps}
			/>
			{/* </div> */}
		</section>
	);
};

export default CourseListContainer;
