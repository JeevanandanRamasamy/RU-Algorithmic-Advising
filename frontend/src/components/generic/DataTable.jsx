import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window"; // Import react-window's List component
import { showErrorToast } from "../toast/Toast"; // adjust the path as needed

const DataTable = ({ apiUrl, updateApiUrl, columns, noDataMessage = "No data available." }) => {
  const [data, setData] = useState([]); // Store the data fetched from the API
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track any errors

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset previous errors

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const result = await response.json();

        // Check if the data is empty or null and show a specific message
        if (!result || (Array.isArray(result) && result.length === 0)) {
          setError(noDataMessage); // No data case
        } else {
          setData(result); // Set the data if available
        }
      } catch (error) {
        setError(error.message); // Set error message
        showErrorToast("Error fetching data.");
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, [apiUrl, noDataMessage]);

  const handleCellEdit = (rowIndex, columnAccessor, newValue) => {
    // Update the table data with the new value
    const updatedData = [...data];
    updatedData[rowIndex][columnAccessor] = newValue;
    setData(updatedData);

    // Send the updated value to the backend using the dynamic update API URL
    updateDatabase(updatedData[rowIndex]);
  };

  const updateDatabase = async (updatedRow) => {
    try {
      const response = await fetch(`${updateApiUrl}/${updatedRow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
      });

      if (!response.ok) {
        throw new Error("Failed to update data.");
      }

      const result = await response.json();
      if (result.success) {
        showErrorToast("Data successfully updated.");
      } else {
        showErrorToast("Error updating data.");
      }
    } catch (error) {
      showErrorToast("Error updating data.");
    }
  };

  const renderEditableCell = (rowIndex, column, value) => {
    // render a dropdown for the "credits" column or any other editable column
    if (column.accessor === "credits") {
      return (
        <select
          value={value}
          onChange={(e) => handleCellEdit(rowIndex, column.accessor, e.target.value)}
          className="w-full"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      );
    }

    // Default case: render text if it's not an editable column
    return value;
  };

  const Row = ({ index, style }) => {
    const row = data[index];
    return (
      <div className="flex w-full" style={style}>
        {columns.map((column) => (
          <div
            key={column.accessor}
            className="px-4 py-2 border-b flex-1 min-w-[150px] break-words truncate" // Tailwind classes for text wrapping and truncation
          >
            {renderEditableCell(index, column, row[column.accessor])}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="flex bg-gray-100 w-full border-b">
        {columns.map((column) => (
          <div key={column.accessor} className="px-4 py-2 font-bold flex-1 min-w-[150px]">
            {column.header}
          </div>
        ))}
      </div>

      {/* Virtualized Table Body */}
      <List
        height={400} // Height of the table body
        itemCount={data.length} // Total number of items (rows)
        itemSize={50} // Height of each row
        width="100%"  // Full width of the container
      >
        {Row}
      </List>

      {data.length === 0 && <div className="text-center py-4">{noDataMessage}</div>}
    </div>
  );
};

export default DataTable;
