import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import { useCourseRequirements } from "../../context/CourseRequirementContext";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { showInfoToast, clearToast } from "../toast/Toast";
import { useSections } from "../../context/SectionsContext";

/**
 * DropdownTable is a component that displays a list of courses with their sections
 * and handles adding/removing courses.
 */
const DropdownTable = ({
	courses,
	limit,
	handleOnAddCourse,
	handleOnRemoveCourse,
	addedCourseIds
}) => {
	const { requirementStrings } = useCourseRequirements();
	const visibleCourses = limit ? courses.slice(0, limit) : courses;
	const [openCourses, setOpenCourses] = useState([]);

	/**
	 * Toggles the visibility of the course details.
	 */
	const toggleOpen = key => {
		setOpenCourses(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
	};

	/**
	 * Handles the action of adding a course.
	 * Triggers the parent callback and waits for its completion.
	 */
	const handleAdd = async (e, course_id) => {
		e.stopPropagation();
		await handleOnAddCourse(course_id);
	};
	/**
	 * Handles the action of removing a course.
	 * Displays a toast message and then triggers the parent callback to remove the course.
	 */
	const handleRemove = async (e, course_id) => {
		e.stopPropagation();
		showInfoToast("Removing Course", "remove-course-record");
		await handleOnRemoveCourse(course_id);
		clearToast("remove-course-record");
	};

	const { selectCoursesMissingRequirements } = useSections();
	const days = { M: "Monday", T: "Tuesday", W: "Wednesday", TH: "Thursday", F: "Friday" };

	return (
		visibleCourses &&
		Object.keys(visibleCourses).length > 0 && (
			<div className="border rounded-xl shadow overflow-hidden">
				{visibleCourses &&
					Object.values(visibleCourses).map(
						({
							course_id,
							course_name,
							credits,
							sections,
							subject_notes,
							course_link
						}) => {
							const isOpen = openCourses.includes(course_id);
							const isAdded = addedCourseIds.includes(course_id);
							const requirementString = requirementStrings[course_id] || "";

							const courseInfo =
								selectCoursesMissingRequirements?.[String(course_id)];
							const updatedRequirementString =
								courseInfo?.requirement_string ?? requirementString;

							const isRed =
								courseInfo && courseInfo?.requirements_fulfilled === false;
							const { openCount, closedCount } = Object.values(sections).reduce(
								(counts, { open_status }) => {
									if (open_status) {
										counts.openCount += 1;
									} else {
										counts.closedCount += 1;
									}
									return counts;
								},
								{ openCount: 0, closedCount: 0 }
							);
							return (
								<div
									key={course_id}
									className="border-b last:border-none">
									<div
										className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
										onClick={() => toggleOpen(course_id)}>
										<Button
											onClick={
												isAdded
													? e => handleRemove(e, course_id)
													: e => handleAdd(e, course_id)
											}
											className="bg-blue-500 hover:bg-blue-700 text-white p-2 w-[25px] rounded"
											label={`${isAdded ? "-" : "+"}`}
										/>
										<div className="flex-1 px-6 flex justify-between items-center">
											<div className="flex flex-col">
												<span className="font-medium">
													{`${course_id} ${course_name} (${credits} credits)`}
												</span>
												<span className="font-medium">
													Sections: open {openCount} |{" "}
													<span className="text-red-600">
														closed {closedCount}
													</span>
													{updatedRequirementString && (
														<>
															{" | "}
															<a
																data-tooltip-id={`tooltip-${course_id}`}
																className={`cursor-pointer underline ${
																	isRed
																		? "text-red-600"
																		: "text-blue-600"
																}`}
																data-tooltip-place="bottom">
																Requirements
															</a>
															<Tooltip
																id={`tooltip-${course_id}`}
																className="bg-black">
																<pre
																	className="text-sm z-10000"
																	dangerouslySetInnerHTML={{
																		__html: updatedRequirementString
																	}}
																/>
															</Tooltip>
														</>
													)}
													{subject_notes && (
														<>
															{" | "}
															<a
																data-tooltip-id={`tooltip-subject_notes-${course_id}`}
																className={`cursor-pointer underline text-blue-600`}
																data-tooltip-place="bottom">
																Subject Notes
															</a>
															<Tooltip
																id={`tooltip-subject_notes-${course_id}`}
																className="bg-black">
																<div
																	className="text-sm z-10000 whitespace-pre-wrap break-words w-[400px]"
																	dangerouslySetInnerHTML={{
																		__html: subject_notes
																	}}
																/>
															</Tooltip>
														</>
													)}{" "}
													{course_link && (
														<>
															{" | "}
															<a
																href={course_link}
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-600 underline">
																Link
															</a>
														</>
													)}{" "}
												</span>
											</div>
											<span className="text-lg">{isOpen ? "▲" : "▼"}</span>
										</div>
									</div>
									<AnimatePresence initial={false}>
										{isOpen && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="overflow-hidden px-4 py-2 bg-white">
												<div className="grid grid-cols-2 gap-x-4 gap-y-4">
													{Object.values(sections).map(
														({
															section_number,
															instructors,
															meeting_times,
															open_status,
															index,
															section_notes
														}) => (
															<div
																key={section_number}
																className={`px-2 py-1 border-3  rounded border-dashed hover:bg-gray-50 ${
																	open_status === false
																		? " border-[#cc0033] text-[#cc0033]"
																		: "text-black"
																}`}>
																{section_notes && (
																	<>
																		<a
																			data-tooltip-id={`tooltip-section_notes-${course_id}`}
																			className={`cursor-pointer underline text-blue-600`}
																			data-tooltip-place="right">
																			notes
																		</a>
																		<Tooltip
																			id={`tooltip-section_notes-${course_id}`}
																			className="bg-black">
																			<pre
																				className="text-sm z-10000"
																				dangerouslySetInnerHTML={{
																					__html: section_notes
																				}}
																			/>
																		</Tooltip>
																	</>
																)}{" "}
																<div className="font-sm">
																	<span className="font-bold">
																		Section:
																	</span>{" "}
																	{section_number}
																</div>
																<div className="font-sm">
																	<span className="font-bold">
																		Index:
																	</span>{" "}
																	{index}
																</div>
																<div className="text-sm">
																	<strong>Instructors:</strong>{" "}
																	{instructors.join(", ")}
																</div>
																<div className="text-sm">
																	<strong>Meeting Times</strong>
																	<ul className="m-0 text-sm">
																		{meeting_times.map(
																			(
																				{
																					formatted_time,
																					day,
																					start_time,
																					end_time,
																					campus,
																					building,
																					room
																				},
																				index
																			) => (
																				<li key={index}>
																					{days[day]}{" "}
																					{formatted_time}{" "}
																					| {campus}{" "}
																					{building}
																					{room
																						? `-${room}`
																						: ""}
																				</li>
																			)
																		)}
																	</ul>
																</div>
															</div>
														)
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							);
						}
					)}
			</div>
		)
	);
};

export default DropdownTable;
