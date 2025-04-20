import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
	const [openCourses, setOpenCourses] = useState([]);
	const toggleOpen = key => {
		setOpenCourses(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
	};

	return (
		<div className="w-full max-w-md border rounded-xl shadow overflow-hidden">
			{selectedCourses &&
				Object.values(selectedCourses).map(
					({ course_id, course_name, credits, sections }) => {
						const isOpen = openCourses.includes(course_id);
						const allSelected = isAllSectionsSelected(course_id, sections);

						return (
							<div
								key={course_id}
								className="border-b last:border-none">
								<div
									className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
									onClick={() => toggleOpen(course_id)}>
									<input
										type="checkbox"
										checked={allSelected}
										onClick={e => handleSelectAll(e, course_id, sections)}
										className="w-4 h-4"
									/>
									<div className="flex-1 mx-4 flex justify-between items-center">
										<span className="font-medium text-sm">
											{`${course_id} ${course_name} (${credits} credits)`}
										</span>
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
											className="overflow-hidden px-2 py-1 bg-white">
											<ul className="space-y-1">
												{Object.values(sections).map(
													({
														index,
														section_number,
														instructors,
														meeting_times
													}) => (
														<li
															key={section_number}
															className="px-2 py-1 border rounded hover:bg-gray-50 flex gap-2 text-sm">
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
															<div>
																<h3 className="font-medium text-xs">
																	Section: {section_number} |
																	Index {index}
																</h3>
																<div className="text-xs">
																	<strong>Instructors:</strong>{" "}
																	{instructors.join(", ")}
																</div>
																<div className="text-xs">
																	<strong>Meeting Times:</strong>
																	<ul className="text-xs">
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
																					{day}{" "}
																					{formatted_time}{" "}
																					{campus !==
																						"** INVALID **" &&
																						` | ${campus}`}{" "}
																					{building}{" "}
																					{room}
																				</li>
																			)
																		)}
																	</ul>
																</div>
															</div>
														</li>
													)
												)}
											</ul>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					}
				)}
		</div>
	);
};

export default CheckboxDropdownTable;
