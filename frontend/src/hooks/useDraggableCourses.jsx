import { useState, useEffect } from "react";

/**
 * Custom hook to manage the drag functionality for courses with boundary restrictions.
 * It tracks the position of the draggable element and ensures it stays within the bounds.
 */
const useDraggableCourses = () => {
	const [bounds, setBounds] = useState({});
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [showFilters, setShowFilters] = useState(false);

	/**
	 * Computes and sets the initial position of the draggable element based on window size.
	 */
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

	/**
	 * Computes and sets the bounds of the draggable area based on window size
	 * and whether filters are visible.
	 */
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

	/**
	 * Enforces the bounds for the draggable element by snapping its position
	 * to the nearest allowed edge if it goes out of bounds.
	 */
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

	/**
	 * Handles the drag event, updating the position of the draggable element
	 * as it is being dragged.
	 */
	const handleDrag = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	};

	/**
	 * Handles the stop event when the user stops dragging the element,
	 * updating the final position.
	 */
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
