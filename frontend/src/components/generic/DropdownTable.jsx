import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

const DropdownTable = ({
	courses,
	limit,
	handleOnAddCourse,
	handleOnRemoveCourse,
	addedCourseIds
}) => {
	const visibleCourses = limit ? courses.slice(0, limit) : courses;
	const [openCourses, setOpenCourses] = useState([]);

	const toggleOpen = key => {
		setOpenCourses(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
	};

	const handleAdd = (e, course_id) => {
		e.stopPropagation();
		handleOnAddCourse(course_id);
	};
	const handleRemove = (e, course_id) => {
		e.stopPropagation();
		handleOnRemoveCourse(course_id);
	};

	return (
		visibleCourses &&
		Object.keys(visibleCourses).length > 0 && (
			<div className="border rounded-xl shadow overflow-hidden">
				{visibleCourses &&
					Object.values(visibleCourses).map(
						({ course_id, course_name, credits, sections }) => {
							const isOpen = openCourses.includes(course_id);
							const isAdded = addedCourseIds.includes(course_id);

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
																className="px-2 py-1 border rounded hover:bg-gray-50">
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
																					start_time,
																					end_time,
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
		)
	);
};

export default DropdownTable;
