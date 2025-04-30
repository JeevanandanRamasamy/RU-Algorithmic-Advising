/**
 * SectionsTable Component
 *
 * This component displays a list of course sections in a table format.
 * Each section row includes:
 * - The section number
 * - The index number (e.g., unique identifier used by the registrar)
 * - A checkbox for selecting or deselecting the section
 *
 * Props:
 * - sections (array): List of available section objects (each containing section_number, index, etc.)
 * - selectedSections (array): List of currently selected section objects
 * - onCheckboxChange (function): Callback triggered when a checkbox is toggled;
 *   receives the full section object as argument
 *
 * Features:
 * - Maintains selection state visually (checked boxes reflect `selectedSections`)
 * - Scrollable container (max-height limited for better layout in small views)
 */

import React from "react";

const SectionsTable = ({ sections, selectedSections, onCheckboxChange }) => {
  return (
    <div className="mt-4 overflow-auto max-h-60">
      <h4 className="font-semibold">Sections:</h4>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Section ID</th>
            <th className="border-b px-4 py-2">Index</th>
            {/* New column for index */}
            <th className="border-b px-4 py-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, index) => (
            <tr key={index}>
              {/* Access the section_number and render it */}
              <td className="border-b px-4 py-2 text-center">
                {section.section_number}
              </td>
              {/* Render index (or any other data) */}
              <td className="border-b px-4 py-2 text-center">
                {section.index}
              </td>
              {/* Render index here */}
              <td className="border-b px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedSections.some(
                    (s) =>
                      s.section_num === section.section_num &&
                      s.index === section.index
                  )}
                  onChange={() => onCheckboxChange(section)} // Pass the full section object
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectionsTable;
