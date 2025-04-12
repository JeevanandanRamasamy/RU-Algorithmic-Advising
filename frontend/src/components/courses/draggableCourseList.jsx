import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import useDraggableCourses from "../../hooks/useDraggableCourses";
import CourseList from "./CourseList";
import DraggableCourseItem from "./draggableCourseItem";
import DropdownItem from "../generic/DropdownItem";
import { schools, subjects } from "../../data/sas";
import useFilterCourses from "../../hooks/useFilterCourses";
import Button from "../generic/Button";

const DraggableCourseList = ({
	title,
	courses,
	excludedCourseIds,
	CourseComponent,
	isOpen,
	setIsOpen,
	requirementStrings
}) => {
	console.log(excludedCourseIds);
	const nodeRef = useRef(null);
	const {
		bounds,
		setBounds,
		position,
		setPosition,
		handleDrag,
		handleStop,
		showFilters,
		setShowFilters
	} = useDraggableCourses();
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
			{isOpen && (
				<div className="fixed w-full h-full pointer-events-none z-50">
					<Draggable
						axis="both"
						nodeRef={nodeRef}
						cancel=".non-draggable"
						bounds={bounds}
						position={position}
						onDrag={handleDrag}
						onStop={handleStop}>
						<div
							ref={element => {
								nodeRef.current = element;
							}}
							className="relative pt-4 pl-4 pointer-events-auto">
							<>
								<Button
									onClick={() => setIsOpen(prev => !prev)}
									className={`absolute top-0 left-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white  border-none cursor-pointer z-50 opacity-100`}
									label="X"
								/>
								<div className="fixed bg-white shadow-lg rounded p-4 w-100 transition-all duration-200 cursor-move h-max-[500px] box-border z-40 opacity-100">
									<section className="h-full w-full bg-white border border-gray-300 rounded shadow-md flex flex-col ">
										<h2 className="m-0 text-center">{title}</h2>
										<div className="w-full max-w-md mx-auto">
											<div
												className="flex items-center justify-between cursor-pointer mb-2 px-2"
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
												className={`grid gap-4 transition-all duration-300 overflow-hidden px-2 ${
													showFilters
														? "max-h-[9999x] opacity-100"
														: "max-h-0 opacity-0"
												}`}>
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
													onChange={e =>
														setSchoolSearchQuery(e.target.value)
													}
													options={schools}
												/>
												<DropdownItem
													placeholder="Search by subject code"
													selectedValue={subjectSearchQuery}
													onChange={e =>
														setSubjectSearchQuery(e.target.value)
													}
													options={subjects}
												/>
											</div>
											<div className="p-2">
												<div
													className={`non-draggable border border-gray-200 rounded-md flex flex-row gap-3 overflow-x-auto overflow-y-hidden h-[200px] p-2`}>
													<CourseList
														courses={filterCourses(
															courses,
															excludedCourseIds
														)}
														CourseItemComponent={DraggableCourseItem}
														limit={limit}
														requirementStrings={requirementStrings}
													/>
												</div>
											</div>
										</div>
									</section>
								</div>
							</>
						</div>
					</Draggable>
				</div>
			)}
		</>
	);
};

export default DraggableCourseList;
