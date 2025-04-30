import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCourseRequirements } from "../../context/CourseRequirementContext";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const CheckboxDropdownTable = ({
	courseRecords,
	selectedCourses,
	setSelectedCourses,
	checkedSections,
	setCheckedSections,
	toggleSectionSelect,
	isSectionSelected,
	handleSelectAll,
	isAllSectionsSelected
}) => {
	const { coursesWithMissingRequirements, requirementStrings } = useCourseRequirements();
	const [openCourses, setOpenCourses] = useState([]);
	const toggleOpen = key => {
		setOpenCourses(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
	};

	const days = { M: "Monday", T: "Tuesday", W: "Wednesday", TH: "Thursday", F: "Fri" };

	return (
		selectedCourses &&
		Object.keys(selectedCourses).length > 0 && (
			<div className="border rounded-xl shadow overflow-hidden">
				{selectedCourses &&
					Object.values(selectedCourses).map(
						({
							course_id,
							course_name,
							credits,
							sections,
							subject_notes,
							course_link
						}) => {
							const isOpen = openCourses.includes(course_id);
							const allSelected = isAllSectionsSelected(course_id, sections);
							const requirementString = requirementStrings[course_id] || "";
							const courseInfo = coursesWithMissingRequirements?.[String(course_id)];
							const updatedRequirementString =
								courseInfo?.requirement_string ?? requirementString;
							const isRed =
								courseInfo && courseInfo?.requirements_fulfilled === false;

							return (
								<div
									key={course_id}
									className="border-b last:border-none">
									<div
										className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
										onClick={() => toggleOpen(course_id)}>
										<input
											type="checkbox"
											checked={allSelected}
											onClick={e => handleSelectAll(e, course_id, sections)}
											className="w-4 h-4"
										/>
										<div className="flex-1 px-6 flex justify-between items-center">
											<span className="font-medium">
												{`${course_id} ${course_name} (${credits} credits)`}{" "}
												{requirementString && (
													<>
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
												{requirementString && subject_notes && " | "}
												{subject_notes && (
													<>
														<a
															data-tooltip-id={`tooltip-subject_notes-${course_id}`}
															className={`cursor-pointer underline text-blue-600`}
															data-tooltip-place="bottom">
															Subject Notes
														</a>
														<Tooltip
															id={`tooltip-subject_notes-${course_id}`}
															className="bg-black">
															<pre
																className="text-sm z-10000"
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
															className="text-blue-500 underline">
															Link
														</a>
													</>
												)}{" "}
											</span>
											<div></div>
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
												<div className="grid grid-cols-4 gap-x-4 gap-y-4 list-none">
													{Object.values(sections).map(
														({
															index,
															section_number,
															instructors,
															meeting_times,
															open_status,
															section_notes
														}) => (
															<li
																key={section_number}
																className={`px-2 py-1 border-3  rounded border-dashed hover:bg-gray-50 ${
																	open_status === false
																		? " border-[#cc0033] text-[#cc0033]"
																		: "text-black"
																}`}>
																<input
																	type="checkbox"
																	checked={isSectionSelected(
																		course_id,
																		index
																	)}
																	onChange={e => {
																		e.stopPropagation();
																		toggleSectionSelect(
																			course_id,
																			index
																		);
																	}}
																	className="w-4 h-4"
																/>
																{section_notes && (
																	<>
																		<a
																			data-tooltip-id={`tooltip-section_notes-${course_id}`}
																			className={`cursor-pointer underline text-blue-600`}
																			data-tooltip-place="right">
																			Section Notes
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
																<div>
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
																		<strong>
																			Instructors:
																		</strong>{" "}
																		{instructors.join(", ")}
																	</div>
																	<div className="text-sm">
																		<strong>
																			Meeting Times:
																		</strong>
																		<ul className="m-0 text-sm">
																			{meeting_times.map(
																				(
																					{
																						formatted_time,
																						day,
																						campus,
																						building,
																						room
																					},
																					index
																				) => (
																					<li key={index}>
																						{days[day]}{" "}
																						{
																							formatted_time
																						}{" "}
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
															</li>
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

export default CheckboxDropdownTable;
