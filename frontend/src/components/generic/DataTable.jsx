import React, { useState, useEffect, useRef } from "react";
import { showErrorToast, showSuccessToast } from "../toast/Toast";
import { useAuth } from "../../context/AuthContext";

const DataTable = ({ apiUrl, updateApiUrl, columns, noDataMessage = "No data available." }) => {
  const { user, role, token } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleRows, setVisibleRows] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  
  const tableRef = useRef(null);
  const ROW_HEIGHT = 40;
  const BUFFER_SIZE = 5; // Extra rows to render above and below visible area

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }

        const result = await response.json();

        if (!result || (Array.isArray(result) && result.length === 0)) {
          setError(noDataMessage);
        } else {
          setData(result);
          calculateVisibleRows(0, result);
        }
      } catch (error) {
        setError(error.message);
        showErrorToast("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, noDataMessage, token]);

  const calculateVisibleRows = (scrollPosition, rows = data) => {
    if (!tableRef.current || rows.length === 0) return;
    
    const tableHeight = tableRef.current.clientHeight;
    const startIndex = Math.max(0, Math.floor(scrollPosition / ROW_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      rows.length - 1,
      Math.ceil((scrollPosition + tableHeight) / ROW_HEIGHT) + BUFFER_SIZE
    );
    
    const visibleIndices = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleIndices.push(i);
    }
    
    setVisibleRows(visibleIndices);
  };

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
    calculateVisibleRows(e.target.scrollTop);
  };

  const handleCellEdit = (rowIndex, columnAccessor, newValue) => {
    const updatedData = [...data];
    const row = { ...updatedData[rowIndex] };
    // Update the edited cell
    row[columnAccessor] = newValue;
    row["admin_id"] = user;
    updatedData[rowIndex] = row;
    setData(updatedData);
    updateDatabase(updatedData[rowIndex]);
  };

  const updateDatabase = async (updatedRow) => {
    try {
      const response = await fetch(`${updateApiUrl}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error("Update failed.");
      }
      showSuccessToast("Data successfully updated.");
    } catch {
      showErrorToast("Error updating data.");
    }
  };

  const renderEditableCell = (rowIndex, column, value) => {
    if (column.accessor === "status" && role !== "student") {
      return (
        <select
          value={value}
          onChange={(e) => handleCellEdit(rowIndex, column.accessor, e.target.value)}
          className="w-full"
        >
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="denied">denied</option>
        </select>
      );
    }

    return value;
  };

  // Calculate column widths
  const columnWidth = 150;
  const tableWidth = columns.length * columnWidth;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full border border-gray-200 rounded">
      {/* Single scrollable container */}
      <div 
        className="overflow-auto" 
        style={{ height: "450px", width: "100%" }}
        onScroll={handleScroll}
        ref={tableRef}
      >
        <div style={{ width: `${tableWidth}px`, minWidth: "100%" }}>
          {/* Header - uses sticky position (Breaks too much if its sticky) */}
          <div className="top-0 z-10 bg-gray-100">
            <div className="flex">
              {columns.map((column) => (
                <div
                  key={column.accessor}
                  className="px-4 py-2 font-bold border-r border-b overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ width: `${columnWidth}px`, flexShrink: 0 }}
                  title={column.header}
                >
                  {column.header}
                </div>
              ))}
            </div>
          </div>
          
          {/* Spacer for virtualization */}
          <div style={{ height: `${data.length * ROW_HEIGHT}px`, position: "relative" }}>
            {/* Only render visible rows */}
            {visibleRows.map(rowIndex => {
              const row = data[rowIndex];
              return (
                <div 
                  key={rowIndex} 
                  className="flex absolute w-full"
                  style={{ top: `${rowIndex * ROW_HEIGHT}px`, height: `${ROW_HEIGHT}px` }}
                >
                  {columns.map((column) => {
                    const value = row[column.accessor];
                    return (
                      <div
                        key={column.accessor}
                        className="px-4 py-2 border-b border-r overflow-hidden whitespace-nowrap text-ellipsis"
                        style={{ width: `${columnWidth}px`, flexShrink: 0 }}
                        title={value?.toString()}
                      >
                        {renderEditableCell(rowIndex, column, value)}
                      </div>
                    );
                  })}
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