import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import CourseListContainer from "./courses/CourseListContainer";
import useDraggableCourses from "../hooks/useDraggableCourses";

// const positions = {
// 	topleft: "top-0 left-0",
// 	topright: "top-0 right-0",
// 	bottomleft: "bottom-0 left-0",
// 	bottomright: "bottom-0 right-0"
// };
const DraggableCourseList = ({
	title,
	searchQuery,
	setSearchQuery,
	courses,
	excludedCourseIds,
	CourseComponent,
	isOpen,
	setIsOpen
}) => {
	const nodeRef = useRef(null);
	const { bounds, setBounds, position, setPosition, handleDrag, handleStop } =
		useDraggableCourses();
	// const [bounds, setBounds] = useState({});
	// const [position, setPosition] = useState({ x: 0, y: 0 });

	// useEffect(() => {
	// 	const computeBounds = () => {
	// 		const vh = window.innerHeight;
	// 		const vw = window.innerWidth;
	// 		setBounds({
	// 			top: 0,
	// 			bottom: vh - 488,
	// 			left: 130,
	// 			right: vw - 450
	// 		});
	// 		setPosition({ x: vw - 450, y: vh - 488 });
	// 		// setBounds({
	// 		// 	top: 0,
	// 		// 	bottom: vh - 45,
	// 		// 	left: 130,
	// 		// 	right: vw - 57
	// 		// });
	// 	};
	// 	window.addEventListener("resize", computeBounds);
	// 	computeBounds();
	// 	return () => {
	// 		window.removeEventListener("resize", computeBounds);
	// 	};
	// }, []);

	// const handleDrag = (e, data) => {
	// 	setPosition({ x: data.x, y: data.y });
	// };

	// const handleStop = (e, data) => {
	// 	setPosition({ x: data.x, y: data.y });
	// };
	// const handleButtonPosition = () => {
	// 	if (buttonRef.current) {
	// 		const rect = buttonRef.current.getBoundingClientRect();
	// 		setButtonPosition({
	// 			top: rect.top,
	// 			left: rect.left
	// 		});
	// 	}
	// };
	// const handleDrag = (e, data) => {
	// 	console.log(data["x"], data["y"]);

	// 	// handleButtonPosition();
	// };
	// const handleDragStop = () => {
	// 	handleButtonPosition();
	// };

	// const calculateContainerPosition = () => {
	// 	const vw = window.innerWidth;
	// 	const vh = window.innerHeight;

	// 	// const buttonLeft = buttonPosition.left;
	// 	// const buttonTop = buttonPosition.top;
	// 	// const buttonRight = buttonLeft + 50; // Assuming button is 50px wide
	// 	// const buttonBottom = buttonTop + 50; // Assuming button is 50px tall
	// };

	// const containerPosition = calculateContainerPosition();
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

								<div className="fixed bg-white shadow-lg rounded p-4 w-100 transition-all duration-200 cursor-move">
									<CourseListContainer
										title={title}
										searchQuery={searchQuery}
										setSearchQuery={setSearchQuery}
										courses={courses}
										excludedCourseIds={excludedCourseIds}
										CourseComponent={CourseComponent}
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
