import React, { useState, useEffect, useRef } from "react";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import { useAuth } from "../../context/AuthContext";

/**
 * DataTable component that displays a scrollable table with editable cells, dynamic data fetching, and delete functionality.
 * Supports customizable columns and conditional rendering based on user roles and data.
 */
const DataTable = ({
	apiUrl,
	updateApiUrl,
	deleteApiUrl,
	columns,
	noDataMessage = "No data available.",
	allowDelete = false,
	deleteRoles = ["admin"],
	reloadFlag,
	onDataUpdate
}) => {
	const { user, role, token } = useAuth();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [visibleRows, setVisibleRows] = useState([]);
	const [scrollTop, setScrollTop] = useState(0);

	const tableRef = useRef(null);
	const scrollTimeout = useRef();
	const ROW_HEIGHT = 40;
	const BUFFER_SIZE = 5;
	const SCROLL_BAR_OFFSET = 20;

	const canDelete = allowDelete && deleteRoles.includes(role);

	/**
	 * Fetches data from the provided API URL and updates the state with the response.
	 * Handles loading, error, and data processing.
	 */
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(apiUrl, {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json"
					}
				});
				if (!response.ok) {
					throw new Error("Failed to fetch data.");
				}

				const result = await response.json();

				// Ensure we have valid data before setting state
				if (Array.isArray(result)) {
					setData(result);
					calculateVisibleRows(0, result);
				} else {
					throw new Error("Invalid data format received from API");
				}
			} catch (error) {
				console.error("Data fetch error:", error);
				setError(error.message);
				showErrorToast("Error fetching data.", "error-fetching");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [apiUrl, reloadFlag]); // Keep only these essential dependencies

	/**
	 * Recalculates the rows that should be visible based on the current scroll position.
	 */
	useEffect(() => {
		if (data.length > 0) {
			// Short timeout to ensure DOM has updated
			setTimeout(() => {
				calculateVisibleRows(scrollTop);
			}, 0);
		}
	}, [data]);

	/**
	 * Calculates the indices of the rows to be displayed based on scroll position.
	 */
	const calculateVisibleRows = (scrollPosition, rows = data) => {
		// Wait until next tick to ensure table ref exists and has dimensions
		setTimeout(() => {
			if (!tableRef.current || !rows || rows.length === 0) return;

			const tableHeight = tableRef.current.clientHeight;
			const startIndex = Math.max(0, Math.floor(scrollPosition / ROW_HEIGHT) - BUFFER_SIZE);
			const endIndex = Math.min(
				rows.length - 1,
				Math.ceil((scrollPosition + tableHeight) / ROW_HEIGHT) + BUFFER_SIZE
			);

			const visibleIndices = [];
			for (let i = startIndex; i <= endIndex; i++) visibleIndices.push(i);
			setVisibleRows(visibleIndices);
		}, 0);
	};

	/**
	 * Handles the scroll event and triggers visible rows recalculation.
	 */
	const handleScroll = e => {
		if (scrollTimeout.current) cancelAnimationFrame(scrollTimeout.current);
		const scrollPosition = e.target.scrollTop;
		scrollTimeout.current = requestAnimationFrame(() => {
			setScrollTop(scrollPosition);
			calculateVisibleRows(scrollPosition);
		});
	};

	/**
	 * Handles the editing of a cell and updates the corresponding row.
	 */
	const handleCellEdit = (rowIndex, columnAccessor, newValue) => {
		const updatedData = [...data];
		const oldRow = { ...updatedData[rowIndex] };
		const updatedRow = { ...oldRow, [columnAccessor]: newValue, admin_id: user };
		let flag = false;
		updatedData[rowIndex] = updatedRow;
		if (
			!(
				(updatedRow["status"] == "approved" && oldRow["status"] == "denied") ||
				(updatedRow["status"] == "denied" && oldRow["status"] == "approved")
			)
		) {
			updatedData.splice(rowIndex, 1);
			flag = true;
		}
		setData(updatedData);

		updateDatabase(updatedRow, flag).catch(() => {
			// Rollback on failure
			updatedData[rowIndex] = oldRow;
			setData([...updatedData]);
		});
		calculateVisibleRows(scrollTop, updatedData);
	};

	/**
	 * Updates the database with the modified row data.
	 */
	const updateDatabase = async (updatedRow, flag) => {
		try {
			const response = await fetch(`${updateApiUrl}`, {
				method: "PUT",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(updatedRow)
			});

			const result = await response.json();
			if (!response.ok || !result.success) throw new Error("Update failed.");

			if (onDataUpdate && typeof onDataUpdate === "function" && flag) {
				onDataUpdate(); // trigger parent to reload all
			}
			showSuccessToast("Data successfully updated.");
		} catch (error) {
			console.error("Update error:", error);
			showErrorToast("Error updating data.");
		}
	};

	/**
	 * Handles the row deletion by making a DELETE request to the API.
	 */
	const handleDeleteRow = async rowIndex => {
		if (!canDelete) return;

		const rowToDelete = data[rowIndex];

		try {
			const response = await fetch(`${deleteApiUrl}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(rowToDelete)
			});

			if (!response.ok) throw new Error("Failed to delete row");

			const updatedData = [...data];
			updatedData.splice(rowIndex, 1);
			setData(updatedData);
			calculateVisibleRows(scrollTop, updatedData);
			showSuccessToast("SPN successfully removed.");
		} catch (error) {
			showErrorToast("Error deleting row.");
			console.error("Delete error:", error);
		}
	};

	/**
	 * Renders an editable cell based on column type and user role.
	 */
	const renderEditableCell = (rowIndex, column, value) => {
		if (column.accessor === "status" && role !== "student") {
			return (
				<select
					value={value || ""}
					onChange={e => handleCellEdit(rowIndex, column.accessor, e.target.value)}
					className="w-full">
					<option value="pending">pending</option>
					<option value="approved">approved</option>
					<option value="denied">denied</option>
				</select>
			);
		}
		return value === undefined || value === null ? "" : value;
	};

	const columnWidth = 150;
	const effectiveColumns = canDelete ? columns.length + 1 : columns.length;
	const tableWidth = effectiveColumns * columnWidth;
	// Two rows minimum displayed (single row and headers), + offset pixels for the scrollbar
	const tableHeight = Math.min(
		450,
		Math.max(
			(data.length + 1) * ROW_HEIGHT + SCROLL_BAR_OFFSET,
			ROW_HEIGHT * 2 + SCROLL_BAR_OFFSET
		)
	);

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p className="text-red-500 text-center py-4">{error}</p>;
	if (!isLoading && (!data || data.length === 0))
		return <p className="text-center py-4">{noDataMessage}</p>;

	return (
		<div className="w-full border border-gray-200 rounded">
			<div
				className="overflow-auto relative"
				style={{ height: `${tableHeight}px`, width: "100%" }}
				onScroll={handleScroll}
				ref={tableRef}>
				<div style={{ width: `${tableWidth}px`, minWidth: "100%" }}>
					{/* Header - using position sticky with full width background */}
					<div
						className="sticky top-0 bg-gray-100 z-4"
						style={{
							width: `${tableWidth}px`,
							minWidth: "100%",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)" // Optional shadow for visual separation
						}}>
						<div className="flex">
							{columns.map(column => (
								<div
									key={column.accessor}
									className="px-4 py-2 font-bold border-r border-b overflow-hidden whitespace-nowrap text-ellipsis bg-gray-100" // Added bg-gray-100 to each cell
									style={{ width: `${columnWidth}px`, flexShrink: 0 }}
									title={column.header}>
									{column.header}
								</div>
							))}

							{/* Delete column header (if applicable) */}
							{canDelete && (
								<div
									className="px-4 py-2 font-bold border-r border-b overflow-hidden whitespace-nowrap text-ellipsis bg-gray-100"
									style={{ width: `${columnWidth}px`, flexShrink: 0 }}>
									Actions
								</div>
							)}
						</div>
					</div>

					<div style={{ height: `${data.length * ROW_HEIGHT}px`, position: "relative" }}>
						{visibleRows.map(rowIndex => {
							const row = data[rowIndex];
							// Add safety check to prevent error when row is undefined
							if (!row) return null;

							return (
								<div
									key={rowIndex}
									className="flex absolute w-full"
									style={{
										top: `${rowIndex * ROW_HEIGHT}px`,
										height: `${ROW_HEIGHT}px`
									}}>
									{columns.map(column => {
										const value = row[column.accessor];
										return (
											<div
												key={column.accessor}
												className="px-4 py-2 border-b border-r overflow-hidden whitespace-nowrap text-ellipsis"
												style={{ width: `${columnWidth}px`, flexShrink: 0 }}
												title={value?.toString()}>
												{renderEditableCell(rowIndex, column, value)}
											</div>
										);
									})}
									{/* Delete button cell (if applicable) */}
									{canDelete && (
										<div
											className="px-4 py-2 border-b border-r flex items-center"
											style={{ width: `${columnWidth}px`, flexShrink: 0 }}>
											{/* If an admin has made a decision (so admin_id exists) will not give remove button*/}
											{row["status"] === "pending" && (
												<button
													onClick={() => handleDeleteRow(rowIndex)}
													className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm cursor-pointer">
													Remove
												</button>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataTable;
