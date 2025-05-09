/**
 * SemesterSelector Component
 *
 * A reusable dropdown component that allows users to select an academic semester
 * by choosing both the year and the season (Spring, Summer, Fall, Winter).
 *
 * Props:
 * - onSemesterSelect (function): Callback triggered whenever both the year and season
 *   selections are updated. Receives (selectedYear, selectedSeason) as arguments.
 *
 * Features:
 * - Dynamically generates a list of the next 5 years starting from the current year
 * - Determines the next upcoming season as the default based on the current month
 * - Uses a custom hook (`useNoPlaceholderDropdown`) to manage dropdown state and rendering
 */

import { useEffect } from "react";
import useNoPlaceholderDropdown from "../../hooks/useNoPlaceholderDropdown";

// Getting current year
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) =>
  (currentYear + i).toString()
);
const seasonOptions = ["Spring", "Summer", "Fall", "Winter"];

const SemesterSelector = ({ onSemesterSelect }) => {
  const { selected: selectedYear, dropdown: yearDropdown } =
    useNoPlaceholderDropdown(yearOptions, currentYear.toString());

  // Optional: determine the next season as default
  const getNextSeason = () => {
    const month = new Date().getMonth();
    if (month < 2) return "Spring";
    if (month < 5) return "Summer";
    if (month < 8) return "Fall";
    return "Winter";
  };

  const { selected: selectedSeason, dropdown: seasonDropdown } =
    useNoPlaceholderDropdown(seasonOptions, getNextSeason());

  // Update parent whenever a new year or season is selected
  useEffect(() => {
    if (selectedYear && selectedSeason) {
      onSemesterSelect(selectedYear, selectedSeason); // Pass values to parent
    }
  }, [selectedYear, selectedSeason, onSemesterSelect]);

  return (
    <div className="flex gap-4">
      <div>
        <label className="block mb-1">Select Year:</label>
        {yearDropdown}
      </div>
      <div>
        <label className="block mb-1">Select Season:</label>
        {seasonDropdown}
      </div>
    </div>
  );
};

export default SemesterSelector;
