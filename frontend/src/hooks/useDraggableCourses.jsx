import { useState, useEffect } from "react";
const useDraggableCourses = () => {
	const [bounds, setBounds] = useState({});
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const computeBounds = () => {
			const vh = window.innerHeight;
			const vw = window.innerWidth;
			setPosition({ x: vw - 420, y: vh - 355 });
		};
		window.addEventListener("resize", computeBounds);
		computeBounds();
		return () => {
			window.removeEventListener("resize", computeBounds);
		};
	}, []);

	useEffect(() => {
		const computeBounds = () => {
			const vh = window.innerHeight;
			const vw = window.innerWidth;
			setBounds(
				showFilters
					? {
							top: 0,
							bottom: vh - 480,
							left: 130,
							right: vw - 420
					  }
					: {
							top: 0,
							bottom: vh - 355,
							left: 130,
							right: vw - 420
					  }
			);
		};
		window.addEventListener("resize", computeBounds);
		computeBounds();
		return () => {
			window.removeEventListener("resize", computeBounds);
		};
	}, [showFilters]);

	useEffect(() => {
		const snapToBounds = () => {
			const { top, bottom, left, right } = bounds;

			setPosition(prevPosition => {
				let newX = prevPosition.x;
				let newY = prevPosition.y;

				if (newX < left) {
					newX = left;
				} else if (newX > right) {
					newX = right;
				}

				if (newY < top) {
					newY = top;
				} else if (newY > bottom) {
					newY = bottom;
				}

				return { x: newX, y: newY };
			});
		};

		// Only call snapToBounds if bounds are set (i.e., bounds are not empty)
		if (bounds && bounds.top !== undefined) {
			snapToBounds();
		}
	}, [bounds]);

	const handleDrag = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	};

	const handleStop = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	};
	return {
		bounds,
		setBounds,
		position,
		setPosition,
		handleDrag,
		handleStop,
		showFilters,
		setShowFilters
	};
};
export default useDraggableCourses;
