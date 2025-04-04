import { useState, useEffect } from "react";
const useDraggableCourses = () => {
	const [bounds, setBounds] = useState({});
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const computeBounds = () => {
			const vh = window.innerHeight;
			const vw = window.innerWidth;
			setBounds({
				top: 0,
				bottom: vh - 488,
				left: 130,
				right: vw - 450
			});
			setPosition({ x: vw - 450, y: vh - 488 });
			// setBounds({
			// 	top: 0,
			// 	bottom: vh - 45,
			// 	left: 130,
			// 	right: vw - 57
			// });
		};
		window.addEventListener("resize", computeBounds);
		computeBounds();
		return () => {
			window.removeEventListener("resize", computeBounds);
		};
	}, []);

	const handleDrag = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	};

	const handleStop = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	};
	return { bounds, setBounds, position, setPosition, handleDrag, handleStop };
};
export default useDraggableCourses;
