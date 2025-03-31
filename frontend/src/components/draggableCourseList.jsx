import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import CourseListContainer from "./courses/CourseListContainer";

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
	CourseComponent
}) => {
	const nodeRef = useRef(null);
	const [isOpen, setIsOpen] = useState(true);
	const [bounds, setBounds] = useState({});
	// const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
	// const buttonRef = useRef(null);

	useEffect(() => {
		const computeBounds = () => {
			const vh = window.innerHeight;
			const vw = window.innerWidth;
			setBounds({
				top: 0,
				bottom: vh - 45,
				left: 130,
				right: vw - 57
			});
		};
		window.addEventListener("resize", computeBounds);
		computeBounds();
		return () => {
			window.removeEventListener("resize", computeBounds);
		};
	}, []);

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
			<div className="fixed w-full h-full ">
				<Draggable
					axis="both"
					nodeRef={nodeRef}
					cancel=".course-item"
					bounds={bounds}>
					<div
						ref={element => {
							nodeRef.current = element;
						}}
						className="relative pt-4 pl-4">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={`absolute top-0 left-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white  border border-black cursor-pointer z-100`}>
							{isOpen ? "+" : "-"}
						</button>

						{isOpen && (
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
						)}
					</div>
				</Draggable>
				//{" "}
			</div>
		</>
	);
};

export default DraggableCourseList;
