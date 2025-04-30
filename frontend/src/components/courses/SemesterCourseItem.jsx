import React from "react";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDrag } from "react-dnd";

/**
 * Represents a course item with a collapsible dropdown and drag-and-drop functionality.
 * - Toggles the visibility of additional course options.
 * - Can be dragged within the UI.
 */
const SemesterCourseItem = ({ hasDelete }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen(prev => !prev);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: "COURSE",
		item: { id: "test-course" },
		// item: { id: course.course_id },
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		})
		// canDrag: !isPlanned // Disable drag when the course is already planned
	}));

	return (
		<div
			ref={drag}
			className={`border rounded-xl shadow overflow-hidden max-w-md w-full
				${isDragging ? "dragging" : ""} `}>
			<div className="border-b">
				<button
					className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
					onClick={toggleOpen}>
					<span className="font-medium">a</span>
					<span>{isOpen ? "▲" : "▼"}</span>
				</button>

				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden px-4 py-2 bg-white">
							<ul className="space-y-1">
								{options.map(({ value, label }) => (
									<li
										key={value}
										className="px-3 py-2 rounded bg-gray-50 hover:bg-gray-100">
										{label}
									</li>
								))}
							</ul>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default SemesterCourseItem;
