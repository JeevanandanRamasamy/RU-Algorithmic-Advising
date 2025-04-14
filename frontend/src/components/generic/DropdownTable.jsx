import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DropdownTable = ({ sections }) => {
	const [openCourses, setOpenCourses] = useState([]);

	const toggleOpen = key => {
		setOpenCourses(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
	};

	const handleAdd = (e, courseId) => {
		e.stopPropagation(); // Prevent dropdown toggle
		console.log("Add clicked for:", courseId);
	};

	return (
		<div className="w-full max-w-md border rounded-xl shadow overflow-hidden">
			{sections &&
				Object.values(sections).map(({ course_id, course_name, credits, sections }) => {
					const isOpen = openCourses.includes(course_id);

					return (
						<div
							key={course_id}
							className="border-b last:border-none">
							{/* Header row */}
							<div
								className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
								onClick={() => toggleOpen(course_id)}>
								{/* Left: Add button (prevent toggling) */}
								<button
									onClick={e => handleAdd(e, course_id)}
									className="text-lg font-bold text-green-600 hover:text-green-800"
									title="Add this course">
									+
								</button>

								{/* Middle + Right: Full clickable area to toggle dropdown */}
								<div className="flex-1 mx-4 flex justify-between items-center">
									<span className="font-medium">
										{`${course_name} (${credits} credits)`}
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
														className="px-3 py-2 border rounded hover:bg-gray-50">
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
																			{day} {start_time} -{" "}
																			{end_time} | {campus},{" "}
																			{building} {room}
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
				})}
		</div>
	);
};
export default DropdownTable;
