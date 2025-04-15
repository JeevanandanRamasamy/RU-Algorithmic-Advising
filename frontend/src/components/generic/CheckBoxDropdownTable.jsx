import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CheckboxDropdownTable = ({ selectedSections }) => {
	const [openCourses, setOpenCourses] = useState([]);
	const [checkedSections, setCheckedSections] = useState({});

	const toggleOpen = key => {
		setOpenCourses(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
	};

	const toggleCourseSelect = (course_id, courseSections) => {
		setCheckedSections(prev => {
			const allSectionNumbers = new Set(
				Object.values(courseSections).map(s => s.section_number)
			);
			const currentSelected = prev[course_id] || new Set();

			const isFullySelected = allSectionNumbers.size === currentSelected.size;

			const updated = new Set();
			if (!isFullySelected) {
				allSectionNumbers.forEach(sn => updated.add(sn));
			}

			return {
				...prev,
				[course_id]: isFullySelected ? new Set() : updated
			};
		});
	};

	const toggleSectionSelect = (course_id, section_number) => {
		setCheckedSections(prev => {
			const currentSet = prev[course_id] || new Set();
			const updatedSet = new Set(currentSet);
			if (updatedSet.has(section_number)) {
				updatedSet.delete(section_number);
			} else {
				updatedSet.add(section_number);
			}
			return { ...prev, [course_id]: updatedSet };
		});
	};

	const isSectionSelected = (course_id, section_number) =>
		checkedSections[course_id]?.has(section_number);

	const isAllSectionsSelected = (course_id, courseSections) =>
		checkedSections[course_id]?.size === Object.keys(courseSections).length;

	return (
		<div className="w-full max-w-md border rounded-xl shadow overflow-hidden">
			{selectedSections &&
				Object.values(selectedSections).map(
					({ course_id, course_name, credits, sections }) => {
						const isOpen = openCourses.includes(course_id);
						const allSelected = isAllSectionsSelected(course_id, sections);

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
										onChange={e => {
											e.stopPropagation();
											toggleCourseSelect(course_id, sections);
											if (!allSelected) {
												handleOnAddCourse(
													course_id,
													Object.values(sections).map(
														s => s.section_number
													)
												);
											}
										}}
									/>
									<div className="flex-1 mx-4 flex justify-between items-center">
										<span className="font-medium">
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
											className="overflow-hidden px-4 py-2 bg-white">
											<ul className="space-y-2">
												{Object.values(sections).map(
													({
														section_number,
														instructors,
														meeting_times
													}) => (
														<li
															key={section_number}
															className="px-3 py-2 border rounded hover:bg-gray-50 flex gap-3">
															<input
																type="checkbox"
																checked={isSectionSelected(
																	course_id,
																	section_number
																)}
																onChange={e => {
																	e.stopPropagation();
																	toggleSectionSelect(
																		course_id,
																		section_number
																	);
																	handleOnAddCourse(course_id, [
																		section_number
																	]);
																}}
															/>
															<div>
																<h3 className="font-medium">
																	Section: {section_number}
																</h3>
																<div className="text-sm">
																	<strong>Instructors:</strong>{" "}
																	{instructors.join(", ")}
																</div>
																<div className="text-sm">
																	<strong>Meeting Times:</strong>
																	<ul>
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
																					| {campus},{" "}
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
