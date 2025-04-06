import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import CourseListContainer from "./courses/CourseListContainer";
import useDraggableCourses from "../hooks/useDraggableCourses";

const DraggableCourseList = ({
	title,
	// searchQuery,
	// setSearchQuery,
	courses,
	excludedCourseIds,
	CourseComponent,
	isOpen,
	setIsOpen
}) => {
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
	return (
		<>
			{isOpen && (
				<div className="fixed w-full h-full pointer-events-none">
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
								<button
									onClick={() => setIsOpen(prev => !prev)}
									className={`absolute top-0 left-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white  border-none cursor-pointer z-100`}>
									X
								</button>
								<div className="fixed bg-white shadow-lg rounded p-4 w-100 transition-all duration-200 cursor-move max-h-[500px] box-border">
									<CourseListContainer
										title={title}
										// searchQuery={searchQuery}
										// setSearchQuery={setSearchQuery}
										courses={courses}
										excludedCourseIds={excludedCourseIds}
										CourseComponent={CourseComponent}
										showFilters={showFilters}
										setShowFilters={setShowFilters}
									/>
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
